import { NextResponse, type NextRequest } from 'next/server'
import { search } from 'duck-duck-scrape'
import { ErrorType } from '@/constant/errors'
import { handleError } from '../../utils'
import { isUndefined, pick } from 'lodash-es'

export const preferredRegion = ['sfo1']

export async function POST(req: NextRequest) {
  const { body } = await req.json()
  const { query } = body

  if (isUndefined(query)) {
    return NextResponse.json({ code: 40001, message: ErrorType.MissingParam }, { status: 400 })
  }

  try {
    const response = await search(query)
    return NextResponse.json(
      response.noResults
        ? []
        : response.results.map((item) => pick(item, ['title', 'description', 'url', 'hostname', 'icon'])),
    )
  } catch (error) {
    if (error instanceof Error) {
      return handleError(error.message)
    }
  }
}