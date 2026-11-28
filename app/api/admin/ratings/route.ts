import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin/session";
import { getRatingsCollection, ratingSearch } from "@/lib/admin/ratings";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  if (!await getCurrentAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { const p=request.nextUrl.searchParams; const pageSize=[10,20,50].includes(Number(p.get("pageSize")))?Number(p.get("pageSize")):20; const search=p.get("search")?.trim().slice(0,100)||""; const query=ratingSearch(search); const c=await getRatingsCollection(); const total=await c.countDocuments(query); const totalPages=Math.max(1,Math.ceil(total/pageSize)); const page=Math.min(totalPages,Math.max(1,Number(p.get("page"))||1)); const rows=await c.aggregate([{ $match: query },{ $sort:{ createdAt:-1 } },{ $facet:{ ratings:[{ $skip:(page-1)*pageSize },{ $limit:pageSize }], summary:[{ $group:{ _id:"$slug", title:{ $first:"$title" }, average:{ $avg:"$rating" }, count:{ $sum:1 } } },{ $sort:{ count:-1 } }] } }]).toArray(); return NextResponse.json({ ratings:rows[0]?.ratings||[], summary:(rows[0]?.summary||[]).map((r:any)=>({...r,average:Math.round(r.average*10)/10})),page,pageSize,total,totalPages }); } catch { return NextResponse.json({ error:"Could not load ratings" },{status:503}); }
}
