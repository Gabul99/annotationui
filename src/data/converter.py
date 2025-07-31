#!/usr/bin/env python3
"""Convert eng_dapie source files to destination format.

Expected inputs
--------------
behavior (eng_dapie).json
cluster  (eng_dapie).json
criteria (eng_dapie).json      # <– 현재 스크립트에선 사용하지 않지만 자리 보존
evaluation (eng_dapie).json
pairData (eng_dapie).json

Usage
-----
$ python build_destination.py --indir /path/to/jsons --out dest.json
"""
import json
import argparse
from pathlib import Path
from collections import defaultdict

###############################################################################
# Utilities
###############################################################################
def load_json(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)

def compact(text: str | None) -> str:
    """Strip and fallback to empty string."""
    return (text or "").strip()

###############################################################################
# Core transformation
###############################################################################
def build_destination() -> list[dict]:
    # ---------- 1. 로드 ----------
    pair_data   = load_json(Path("./pairData (horror keyword).json"))   # query/response 원본 ✔
    evaluations = load_json(Path("./evaluation (horror keyword).json")) # behaviors 모음 ✔
    clusters    = load_json(Path("./cluster (horror keyword).json"))    # cluster 이름 ↔ ID

    # ---------- 2. 빠른 조회용 인덱스 ----------
    # (a) clusterId → clusterName
    cluster_name = {c["id"]: c["name"] for c in clusters}

    # (b) pairDataId → behaviors (중복 가능하므로 나중에 dedup)
    behaviors_by_pair: dict[str, list[dict]] = defaultdict(list)
    for ev in evaluations:
        pid = ev["pairDataId"]
        behaviors_by_pair[pid].extend(ev.get("behaviors", []))

    # ---------- 3. destination 구조 생성 ----------
    destination = []
    for running_pid, item in enumerate(pair_data, start=1):
        pair_id = item["id"]
        record = {
            "pid": running_pid,               # 단순 연속번호
            "query":   compact(item["query"]),    # :contentReference[oaicite:3]{index=3}
            "response": compact(item["response"]),
            # target_sentence, expected, type, condition 등은 필요 시 추가
            "behaviors": []
        }

        seen = set()  # behavior 중복 제거용(id 기반)
        for b in behaviors_by_pair.get(pair_id, []):
            bid = b["id"]
            if bid in seen:
                continue
            seen.add(bid)

            beh_obj = {
                "behavior":   compact(b["behavior"]),
                "feature":    compact(b["feature"]),
                "reasoning":  compact(b["reasoning"]),
                "isPositive": bool(b["isPositive"])
            }
            # cluster 이름이 있으면 추가
            cid = b.get("clusterId")
            if cid and cid in cluster_name:
                beh_obj["clusterName"] = cluster_name[cid]

            record["behaviors"].append(beh_obj)

        destination.append(record)

    return destination

###############################################################################
# CLI
###############################################################################
def main():
    parser = argparse.ArgumentParser(description="Build destination JSON file.")
    parser.add_argument("--out", default="dest.json",
                        help="Output file path (default: dest.json)")
    args = parser.parse_args()

    output_path = Path(args.out)

    dest = build_destination()
    output_path.write_text(
        json.dumps(dest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"✅  Wrote {len(dest):,} records to {output_path}")

if __name__ == "__main__":
    main()
