import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');

    // 1. Check secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // 2. Read payload from Supabase webhook
    const payload = await request.json();
    const { table, type, record, old_record } = payload;
    
    // 3. Determine which paths to revalidate based on the table
    const pathsToRevalidate: string[] = [];

    if (table === 'blog_posts') {
      pathsToRevalidate.push('/blog');
      if (type === 'INSERT' || type === 'UPDATE') {
        pathsToRevalidate.push(`/blog/${record.slug}`);
      } else if (type === 'DELETE') {
        pathsToRevalidate.push(`/blog/${old_record.slug}`);
      }
    } 
    else if (table === 'services') {
      pathsToRevalidate.push('/services');
      if (type === 'INSERT' || type === 'UPDATE') {
        pathsToRevalidate.push(`/services/${record.slug}`);
      } else if (type === 'DELETE') {
        pathsToRevalidate.push(`/services/${old_record.slug}`);
      }
    }
    else if (table === 'case_studies') {
      pathsToRevalidate.push('/case-studies');
      if (type === 'INSERT' || type === 'UPDATE') {
        pathsToRevalidate.push(`/case-studies/${record.slug}`);
      } else if (type === 'DELETE') {
        pathsToRevalidate.push(`/case-studies/${old_record.slug}`);
      }
    }

    // 4. Trigger revalidation
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
      console.log(`Revalidated: ${path}`);
    }

    return NextResponse.json({ revalidated: true, now: Date.now(), paths: pathsToRevalidate });
  } catch (err) {
    console.error('Revalidation error:', err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
