"use server"

import { createGenerationPlan, type GenerationPlan } from "../../../../bin/name-generator"
import { WORDNET_DEFINITIONS } from "../../../../bin/wordnet-definitions"

export type NameResult = { name: string; meaning: string }

const LETTERS = "abcdefghijklmnopqrstuvwxyz"
const PAGE_SIZE = 500

// Building a plan fills its count memo, the expensive part. Paging and letter jumps
// reuse the same query, so keep the last few plans warm.
const PLAN_CACHE_LIMIT = 24
const planCache = new Map<string, GenerationPlan>()

function getPlan(targetLength: number, prefix: string, suffix: string, contains: string) {
  const key = `${targetLength}:${prefix}:${suffix}:${contains}`
  const cached = planCache.get(key)

  if (cached) {
    planCache.delete(key)
    planCache.set(key, cached)
    return cached
  }

  const plan = createGenerationPlan(targetLength, prefix, suffix, contains)
  planCache.set(key, plan)

  if (planCache.size > PLAN_CACHE_LIMIT) {
    const oldest = planCache.keys().next().value
    if (oldest !== undefined) planCache.delete(oldest)
  }

  return plan
}

function readPage(plan: GenerationPlan, skip: number, limit: number) {
  const results: NameResult[] = []

  for (const name of plan.namesFrom(skip)) {
    results.push({ name, meaning: WORDNET_DEFINITIONS.get(name) ?? "" })
    if (results.length >= limit) break
  }

  return results
}

// Offset of each first letter in the alphabetical stream, or -1 when no name starts with it.
function letterOffsets(plan: GenerationPlan, prefix: string) {
  const offsets: Record<string, number> = {}

  for (const letter of LETTERS) offsets[letter] = -1

  if (plan.count === 0) return offsets

  if (prefix) {
    offsets[prefix[0]!] = 0
    return offsets
  }

  let offset = 0
  for (const [letter, count] of plan.branchCounts()) {
    offsets[letter] = offset
    offset += count
  }

  return offsets
}

const clampLimit = (limit: number) => Math.min(Math.max(1, Math.floor(limit)), PAGE_SIZE)

export async function searchNamesAction(
  targetLength: number,
  prefix: string,
  suffix: string,
  contains: string,
) {
  try {
    const plan = getPlan(targetLength, prefix, suffix, contains)

    return {
      count: plan.count,
      results: readPage(plan, 0, PAGE_SIZE),
      offsets: letterOffsets(plan, prefix),
    }
  } catch (error) {
    console.error("Error generating names:", error)
    return { count: 0, results: [] as NameResult[], offsets: {} as Record<string, number> }
  }
}

export async function generateNamesAction(
  targetLength: number,
  prefix: string,
  suffix: string,
  contains: string,
  skip = 0,
  limit = PAGE_SIZE,
) {
  try {
    const plan = getPlan(targetLength, prefix, suffix, contains)
    return { count: plan.count, results: readPage(plan, Math.max(0, skip), clampLimit(limit)) }
  } catch (error) {
    console.error("Error generating names:", error)
    return { count: 0, results: [] as NameResult[] }
  }
}
