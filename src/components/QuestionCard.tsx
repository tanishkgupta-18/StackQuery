"use client";

import React from "react";
import { BorderBeam } from "./magicui/border-beam";
import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import { avatars } from "@/models/client/config";
import convertDateToRelativeTime from "@/utils/relativeTime";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
    const [height, setHeight] = React.useState(0);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight);
        }
    }, [ref]);

    return (
        <div
            ref={ref}
            className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-white/15 bg-white/5 p-5 hover:bg-white/10 transition sm:flex-row shadow-md"
        >
            <BorderBeam size={height} duration={12} delay={9} />

            {/* Votes/Answers */}
            <div className="shrink-0 text-sm sm:text-right text-gray-300 space-y-1 w-24 sm:w-28">
                <p className="font-semibold">
                    <span className="text-indigo-400">{ques.totalVotes}</span> votes
                </p>
                <p className="font-semibold">
                    <span className="text-green-400">{ques.totalAnswers}</span> answers
                </p>
            </div>

            {/* Content */}
            <div className="relative w-full space-y-2">
                <Link
                    href={`/questions/${ques.$id}/${slugify(ques.title)}`}
                    className="block text-lg font-semibold text-orange-400 hover:text-orange-500 transition"
                >
                    {ques.title}
                </Link>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {ques.tags.map((tag: string) => (
                        <Link
                            key={tag}
                            href={`/questions?tag=${tag}`}
                            className="text-xs font-medium px-2 py-1 bg-indigo-500/10 text-indigo-300 rounded-md hover:bg-indigo-500/20 transition"
                        >
                            #{tag}
                        </Link>
                    ))}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center justify-between text-sm text-gray-400 mt-2 gap-2">
                    <div className="flex items-center gap-2">
                        <img
                            src={avatars.getInitials(ques.author.name, 24, 24)}
                            alt={ques.author.name}
                            className="w-6 h-6 rounded-full border border-gray-700"
                        />
                        <Link
                            href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
                            className="font-medium text-white hover:text-orange-300"
                        >
                            {ques.author.name}
                        </Link>
                        <span className="text-yellow-500 font-semibold">({ques.author.reputation})</span>
                    </div>
                    <span className="italic text-sm">asked {convertDateToRelativeTime(new Date(ques.$createdAt))}</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
