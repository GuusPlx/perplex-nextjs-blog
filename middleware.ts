import { NextRequest, NextResponse } from 'next/server'

type mockUmsResponse = {
  visitorId: string
}

async function registerPageView(ip: string): Promise<mockUmsResponse> {
  const data = fetch('https://ums-mock.herokuapp.com?' + new URLSearchParams({
    ip: ip ?? 'unknown ip',
  }))
    .then(response => response.json())

  return data
}

export default async function middleware(req: NextRequest) {
  const { nextUrl: url } = req;

  try {
    console.log(req);
    const data = await registerPageView(req.ip);
    const visitorId = data.visitorId;

    console.log(visitorId);
  
    if(visitorId === '12345678') {
      req.nextUrl.pathname = '/personalisation'
      return NextResponse.rewrite(req.nextUrl)
    }
  } catch (e) {
    console.log(e);
  }

  return NextResponse.rewrite(url)
}
// config with custom matcher
export const config = {
  matcher: '/',
};