"use strict";(()=>{var e={};e.id=742,e.ids=[742],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8678:e=>{e.exports=import("pg")},7561:e=>{e.exports=require("node:fs")},9411:e=>{e.exports=require("node:path")},5204:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{originalPathname:()=>h,patchFetch:()=>p,requestAsyncStorage:()=>u,routeModule:()=>l,serverHooks:()=>c,staticGenerationAsyncStorage:()=>m});var o=a(3278),i=a(5002),n=a(4877),s=a(645),d=e([s]);s=(d.then?(await d)():d)[0];let l=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/testimonials/moderate/route",pathname:"/api/testimonials/moderate",filename:"route",bundlePath:"app/api/testimonials/moderate/route"},resolvedPagePath:"C:\\Users\\Suwe\\Desktop\\Moderate_code\\app\\api\\testimonials\\moderate\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:u,staticGenerationAsyncStorage:m,serverHooks:c}=l,h="/api/testimonials/moderate/route";function p(){return(0,n.patchFetch)({serverHooks:c,staticGenerationAsyncStorage:m})}r()}catch(e){r(e)}})},645:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{GET:()=>d});var o=a(1309),i=a(1305),n=e([i]);function s(e,t,a=200){let r=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${e}</title>
    <style>
      body { font-family: Arial, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 32px; }
      .card { max-width: 640px; margin: 0 auto; background: #111827; border: 1px solid #334155; border-radius: 12px; padding: 24px; }
      h1 { margin-top: 0; color: #93c5fd; }
      a { color: #60a5fa; }
      p { line-height: 1.5; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${e}</h1>
      <p>${t}</p>
      <p><a href="/testimonials">Return to Testimonials</a></p>
    </div>
  </body>
</html>`;return new o.NextResponse(r,{status:a,headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store, max-age=0"}})}async function d(e){let{searchParams:t}=new URL(e.url),a=t.get("key")||"",r=Number(t.get("id")||"0"),o=t.get("action"),n=process.env.TESTIMONIAL_MODERATION_KEY;return n&&a===n?r&&("approve"===o||"reject"===o)?await (0,i.k0)(r,{status:"approve"===o?"approved":"rejected"})?s("approve"===o?"Testimonial Approved":"Testimonial Rejected","approve"===o?"Testimonial approved and published.":"Testimonial rejected.",200):s("Moderation Failed","Testimonial not found.",404):s("Invalid Request","Missing or invalid moderation parameters.",400):s("Unauthorized","Invalid moderation key.",401)}i=(n.then?(await n)():n)[0],r()}catch(e){r(e)}})}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[787,833,305],()=>a(5204));module.exports=r})();