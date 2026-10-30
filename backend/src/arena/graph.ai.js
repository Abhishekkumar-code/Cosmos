import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";
import { groqModel, judgeModel, cohereModel } from "./model.ai.js";
import { HumanMessage } from "@langchain/core/messages";

const ArenaState = Annotation.Root({
    problem: Annotation({ reducer: (_, v) => v, default: () => "" }),
    solution_1: Annotation({ reducer: (_, v) => v, default: () => "" }),
    solution_2: Annotation({ reducer: (_, v) => v, default: () => "" }),
    solution_1_error: Annotation({ reducer: (_, v) => v, default: () => null }),
    solution_2_error: Annotation({ reducer: (_, v) => v, default: () => null }),
    judge: Annotation({
        reducer: (_, v) => v,
        default: () => ({
            solution_1: 0,
            solution_2: 0,
            solution_1_reasoning: "",
            solution_2_reasoning: "",
        }),
    }),
});

const safeInvoke = async (model, message) => {
    try {
        const res = await model.invoke([new HumanMessage(message)]);
        return { content: String(res.content), error: null };
    } catch (err) {
        const msg = err?.message || "Model error";
        const isRateLimit = msg.includes("rate_limit") || msg.includes("429") || msg.includes("Rate limit");
        return {
            content: null,
            error: isRateLimit ? "Rate limit exceeded — try again in a moment" : msg,
        };
    }
};

const solutionNode = async (state) => {
    const [groqResult, cohereResult] = await Promise.all([
        safeInvoke(groqModel, state.problem),
        safeInvoke(cohereModel, state.problem),
    ]);

    return {
        solution_1: groqResult.content || "",
        solution_1_error: groqResult.error,
        solution_2: cohereResult.content || "",
        solution_2_error: cohereResult.error,
    };
};

const judgeSchema = z.object({
    solution_1_score: z.number(),
    solution_2_score: z.number(),
    solution_1_reasoning: z.string(),
    solution_2_reasoning: z.string(),
});

const judgeNode = async (state) => {
    const { problem, solution_1, solution_2, solution_1_error, solution_2_error } = state;

    const s1 = solution_1_error ? `[Error: ${solution_1_error}]` : solution_1;
    const s2 = solution_2_error ? `[Error: ${solution_2_error}]` : solution_2;

    if (!solution_1 && !solution_2) {
        return {
            judge: {
                solution_1: 0,
                solution_2: 0,
                solution_1_reasoning: solution_1_error || "No response",
                solution_2_reasoning: solution_2_error || "No response",
            },
        };
    }

    try {
        const structured = judgeModel.withStructuredOutput(judgeSchema);

        const judgeResponse = await structured.invoke([
            new HumanMessage(
                `You are an AI judge. Score each answer from 0 to 10. If a model had an error, score it 0.
Return ONLY valid JSON with keys: solution_1_score, solution_2_score, solution_1_reasoning, solution_2_reasoning.

Problem: ${problem}

Answer 1 (Groq): ${s1}

Answer 2 (Cohere): ${s2}`
            ),
        ]);

        return {
            judge: {
                solution_1: Math.min(10, Math.max(0, Number(judgeResponse.solution_1_score) || 0)),
                solution_2: Math.min(10, Math.max(0, Number(judgeResponse.solution_2_score) || 0)),
                solution_1_reasoning: judgeResponse.solution_1_reasoning || "",
                solution_2_reasoning: judgeResponse.solution_2_reasoning || "",
            },
        };
    } catch (err) {
        const s1Score = solution_1_error ? 0 : 7;
        const s2Score = solution_2_error ? 0 : 7;
        return {
            judge: {
                solution_1: s1Score,
                solution_2: s2Score,
                solution_1_reasoning: solution_1_error || "Answer provided",
                solution_2_reasoning: solution_2_error || "Answer provided",
            },
        };
    }
};

const graph = new StateGraph(ArenaState)
    .addNode("solution", solutionNode)
    .addNode("judge_node", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge_node")
    .addEdge("judge_node", END)
    .compile();

export default async function rungraph(problem) {
    const result = await graph.invoke({ problem });
    return result;
}
