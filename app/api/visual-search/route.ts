import { NextResponse } from 'next/server';
export async function POST(){return NextResponse.json({message:'Visual Search service is ready for an embedding provider. Configure VISUAL_SEARCH_PROVIDER and provider credentials. No similarity score is fabricated.'},{status:501})}
