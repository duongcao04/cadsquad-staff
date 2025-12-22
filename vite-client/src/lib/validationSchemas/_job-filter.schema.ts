import { z } from "zod";

// Helper: Converts Set/Array to CSV string
const arrayToString = z.union([z.string(), z.array(z.string())]).transform((val) => {
	if (Array.isArray(val)) return val.join(",");
	return val;
});

const optionalIsoDate = z.string().optional();

export const JobFiltersInputSchema = z.object({
	clientName: z.string().trim().optional(),

	// Arrays & Operators
	type: arrayToString.optional(),
	typeOperator: z.enum(["AND", "OR"]).default("OR").optional(),

	status: arrayToString.optional(),
	statusOperator: z.enum(["AND", "OR"]).default("OR").optional(),

	assignee: arrayToString.optional(),
	assigneeOperator: z.enum(["AND", "OR"]).default("OR").optional(),

	paymentChannel: arrayToString.optional(),

	// Dates
	createdAtFrom: optionalIsoDate,
	createdAtTo: optionalIsoDate,
	dueAtFrom: optionalIsoDate,
	dueAtTo: optionalIsoDate,
	finishedAtFrom: optionalIsoDate,
	finishedAtTo: optionalIsoDate,

	// Costs
	incomeCostMin: z.string().regex(/^\d*$/, 'Numeric only').optional(),
	incomeCostMax: z.string().regex(/^\d*$/, 'Numeric only').optional(),
	staffCostMin: z.string().regex(/^\d*$/, 'Numeric only').optional(),
	staffCostMax: z.string().regex(/^\d*$/, 'Numeric only').optional(),
});

export type TJobFiltersInput = z.infer<typeof JobFiltersInputSchema>;