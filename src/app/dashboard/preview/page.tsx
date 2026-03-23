"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { apiFetch, formatApiErrorMessage } from "@/lib/api-client";

type CandidateRow = {
  name: string;
  votes: number;
  percentage: number;
  color: string;
  image?: string;
};

type PositionRow = {
  title: string;
  candidates: CandidateRow[];
};

const COLORS = ["#243160", "#5E6993", "#94A3B8", "#B3C2DD", "#D7DFEE"];

const PieChart = ({ candidates }: { candidates: CandidateRow[] }) => {
  let acc = 0;

  return (
    <div className="relative w-full aspect-square max-w-[180px] md:max-w-[220px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {candidates.map((cand, i) => {
          const start = acc;
          acc += cand.percentage;
          const startAngle = (start / 100) * 360;
          const endAngle = (acc / 100) * 360;

          const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);
          const largeArc = cand.percentage > 50 ? 1 : 0;

          return (
            <path
              key={`${cand.name}-${i}`}
              d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={cand.color}
              stroke="white"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const queryPublikId = searchParams.get("id");

  const [elections, setElections] = useState<Array<{ publik_id: string; title: string }>>([]);
  const [selectedPublikId, setSelectedPublikId] = useState<string>(queryPublikId || "");
  const [positions, setPositions] = useState<PositionRow[]>([]);
  const [turnoutText, setTurnoutText] = useState("0");
  const [electionTitle, setElectionTitle] = useState("Live Preview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedElectionTitle = useMemo(() => {
    const hit = elections.find((item) => item.publik_id === selectedPublikId);
    return hit?.title || electionTitle;
  }, [elections, selectedPublikId, electionTitle]);

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      setError("");
      try {
        const list = await apiFetch<any>("/election/");
        if (list.status === "success") {
          const rows = (list.data || []).map((item: any) => ({
            publik_id: String(item.publik_id || item.uid || ""),
            title: String(item.title || "Election"),
          }));
          setElections(rows);

          const fallbackId = queryPublikId || rows[0]?.publik_id || "";
          setSelectedPublikId((current) => current || fallbackId);
        }
      } catch (err) {
        setError(formatApiErrorMessage(err, "Could not load elections."));
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [queryPublikId]);

  useEffect(() => {
    if (!selectedPublikId) return;

    const fetchPreview = async () => {
      setIsLoading(true);
      setError("");
      try {
        const result = await apiFetch<any>(`/election/live-preview/${selectedPublikId}/`);
        if (result.status === "success") {
          const data = result.data || {};
          const turnout = data.turnout || {};
          const voted = Number(turnout.total_voted ?? turnout.voted ?? 0);
          const eligible = Number(turnout.total_eligible ?? turnout.total ?? 0);
          const percent =
            turnout.percent != null
              ? Number(turnout.percent)
              : eligible > 0
              ? Math.round((voted / eligible) * 100)
              : 0;

          const mappedPositions = (data.positions || []).map((position: any) => ({
            title: String(position.title || "Position"),
            candidates: (position.candidates || []).map((candidate: any, index: number) => ({
              name: String(candidate.name || "Candidate"),
              votes: Number(candidate.votes ?? candidate.vote_count ?? 0),
              percentage: Number(candidate.percent ?? candidate.percentage ?? 0),
              image: candidate.image || undefined,
              color: COLORS[index % COLORS.length],
            })),
          }));

          setPositions(mappedPositions);
          setElectionTitle(String(data.election_title || selectedElectionTitle || "Live Preview"));
          setTurnoutText(`${percent}% (${voted})`);
        }
      } catch (err) {
        setError(formatApiErrorMessage(err, "Could not load live preview."));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, [selectedPublikId, selectedElectionTitle]);

  return (
    <div className="flex flex-col gap-6 mb-12">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Live Preview : <span className="text-gray-600 font-semibold">{selectedElectionTitle}</span>
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">
            Total Turnout : <span className="text-gray-900 font-bold">{turnoutText}</span>
          </p>
        </div>

        <select
          value={selectedPublikId}
          onChange={(e) => setSelectedPublikId(e.target.value)}
          className="h-10 min-w-[240px] rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-800 focus:outline-none focus:border-[#405189]"
        >
          {elections.map((item) => (
            <option key={item.publik_id} value={item.publik_id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="bg-white rounded-[24px] p-10 shadow-sm border border-gray-100 text-sm font-semibold text-gray-500">
          Loading preview...
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {positions.map((position, pIdx) => (
            <div
              key={`${position.title}-${pIdx}`}
              className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-8 lg:items-center"
            >
              <div className="lg:w-[45%] flex flex-col gap-4">
                <h2 className="text-base md:text-lg font-bold text-gray-900">{position.title}</h2>
                <div className="flex-1 flex items-center justify-center py-2">
                  <PieChart candidates={position.candidates} />
                </div>
              </div>

              <div className="lg:w-[55%] flex flex-col gap-6">
                {position.candidates.map((cand, cIdx) => (
                  <div key={`${cand.name}-${cIdx}`} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0 relative">
                        {cand.image ? (
                          <Image src={cand.image} alt={cand.name} fill className="object-cover" />
                        ) : (
                          <Image
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cand.name)}`}
                            alt={cand.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-none mb-1">{cand.name}</h3>
                        <p className="text-xs font-semibold text-gray-500">{cand.votes} votes</p>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${cand.percentage}%`, backgroundColor: cand.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
