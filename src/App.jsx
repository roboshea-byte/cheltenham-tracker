import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend, ReferenceLine,
} from 'recharts';
import {
  FESTIVAL_START, FESTIVAL_DAYS, CURRENT_GOING, GOING_HISTORY,
  WEATHER_FORECAST, FESTIVAL_FORECAST, RAIL_MOVEMENTS,
  KEY_RACES, GOING_OUTLOOK, DAY_PREDICTIONS, GOING_GUIDE,
  TRACK_FEATURES,
} from './data';

const C = {
  bg:'#f0f4f2',white:'#ffffff',card:'#ffffff',cardAlt:'#f5f8f6',
  border:'#dce5df',accent:'#0f766e',accentDk:'#0a5c56',accentLt:'#e6f5f3',
  gold:'#b8860b',goldLt:'#fdf6e3',text:'#1a2e23',textMid:'#3d5a4a',textDim:'#6b8a78',
  red:'#dc2626',redLt:'#fef2f2',orange:'#d97706',orangeLt:'#fffbeb',
  blue:'#2563eb',blueLt:'#eff6ff',green:'#16a34a',greenLt:'#f0fdf4',
  oldLine:'#b8860b',newLine:'#0f766e',ccLine:'#d97706',
  rainBar:'rgba(37,99,235,0.25)',
  heroGrad:'linear-gradient(135deg,#0f766e 0%,#065f46 50%,#064e3b 100%)',
  warmGrad:'linear-gradient(135deg,#fdf6e3 0%,#fef9ee 100%)',
  coolGrad:'linear-gradient(135deg,#e6f5f3 0%,#ecfdf5 100%)',
  blueGrad:'linear-gradient(135deg,#eff6ff 0%,#f0f9ff 100%)',
};
const font="'Inter',-apple-system,BlinkMacSystemFont,sans-serif";
const mono="'JetBrains Mono','SF Mono',monospace";

function getGoingColour(g){g=g.toLowerCase();if(g.includes('heavy'))return C.red;if(g.includes('soft')&&!g.includes('good'))return C.orange;if(g.includes('good to soft')||(g.includes('good')&&g.includes('soft')))return'#ca8a04';if(g.includes('good')&&!g.includes('firm'))return C.green;if(g.includes('firm'))return C.accent;return C.text;}
function getGoingBg(g){g=g.toLowerCase();if(g.includes('heavy'))return C.redLt;if(g.includes('soft')&&!g.includes('good'))return C.orangeLt;if(g.includes('good to soft')||(g.includes('good')&&g.includes('soft')))return C.goldLt;if(g.includes('good')&&!g.includes('firm'))return C.greenLt;return C.accentLt;}
function getStickColour(v){if(v<3)return C.red;if(v<5)return C.orange;if(v<7)return'#ca8a04';if(v<9)return C.green;return C.accent;}
function gradeStyle(g){if(g==='G1')return{bg:C.gold,color:'#fff'};if(g==='G2')return{bg:'#64748b',color:'#fff'};return{bg:'#a16207',color:'#fff'};}
function getCountdown(){const diff=new Date(FESTIVAL_START)-new Date();if(diff<=0)return{days:0,hours:0,label:'Festival is LIVE!'};return{days:Math.floor(diff/864e5),hours:Math.floor((diff%864e5)/36e5),label:'until first race'};}
function glabel(v){if(v<=1.25)return'Heavy';if(v<=1.75)return'Hvy/Sft';if(v<=2.25)return'Soft';if(v<=2.75)return'Sft/GS';if(v<=3.25)return'Gd/Sft';if(v<=3.75)return'GS/Gd';if(v<=4.25)return'Good';if(v<=4.75)return'Gd/GF';if(v<=5.25)return'Gd/Fm';if(v<=5.75)return'GF/Fm';if(v<=6.25)return'Firm';return'Hard';}
function wIcon(code){if(code<=1)return'☀️';if(code<=3)return'⛅';if(code<=48)return'🌫️';if(code<=57)return'🌦️';if(code<=67)return'🌧️';if(code<=77)return'🌨️';if(code<=82)return'🌧️';if(code<=86)return'🌨️';if(code<=99)return'⛈️';return'☁️';}
function wDesc(code){if(code<=1)return'Clear';if(code<=3)return'Partly cloudy';if(code<=48)return'Fog';if(code<=55)return'Drizzle';if(code<=57)return'Freezing drizzle';if(code<=65)return'Rain';if(code<=67)return'Freezing rain';if(code<=75)return'Snow';if(code<=77)return'Snow grains';if(code<=82)return'Showers';if(code<=86)return'Snow showers';if(code<=99)return'Thunderstorm';return'Cloudy';}

function GoingTooltip({active,payload,label}){
  if(!active||!payload||!payload.length)return null;
  return(<div style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 16px',fontSize:13,boxShadow:'0 4px 12px rgba(0,0,0,0.08)',fontFamily:font}}>
    <div style={{fontWeight:700,color:C.text,marginBottom:6}}>{label}</div>
    {payload.map((p,i)=>p.dataKey!=='rainfall'?<div key={i} style={{color:p.color,marginBottom:3,fontWeight:500}}>{p.name}: {glabel(p.value)}</div>:<div key={i} style={{color:C.blue,marginBottom:3}}>Rainfall: {p.value}mm</div>)}
  </div>);
}

const Card=({children,style,gradient})=>(<div style={{background:gradient||C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28,marginBottom:20,boxShadow:'0 1px 4px rgba(0,0,0,0.04)',...style}}>{children}</div>);
const CardTitle=({icon,children,right})=>(<div style={{fontSize:13,fontWeight:700,color:C.accent,marginBottom:18,textTransform:'uppercase',letterSpacing:'0.8px',display:'flex',alignItems:'center',gap:8,fontFamily:font}}>{icon&&<span style={{fontSize:16}}>{icon}</span>}<span>{children}</span>{right&&<span style={{fontSize:11,fontWeight:500,color:C.textDim,marginLeft:'auto',textTransform:'none',letterSpacing:0}}>{right}</span>}</div>);
const Pill=({active,onClick,children})=>(<button onClick={onClick} style={{padding:'8px 18px',borderRadius:100,fontSize:13,fontWeight:600,cursor:'pointer',transition:'all 0.15s',fontFamily:font,border:active?`2px solid ${C.accent}`:`1px solid ${C.border}`,background:active?C.accentLt:'#fff',color:active?C.accent:C.textDim}}>{children}</button>);
function GoingScaleBar(){return(<div style={{display:'flex',borderRadius:100,overflow:'hidden',height:10,marginBottom:12}}>{GOING_GUIDE.map((g,i)=><div key={i} style={{flex:1,background:g.colour,opacity:0.85}} title={g.name}/>)}</div>);}

/* ──── LIVE WEATHER HOOK ──── */
function useLiveWeather(){
  const[weather,setWeather]=useState(null);
  const[fetchTime,setFetchTime]=useState(null);
  useEffect(()=>{
    const go=async()=>{try{
      const r=await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.9272&longitude=-2.0689&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=Europe/London&forecast_days=14');
      if(!r.ok)throw new Error();const d=await r.json();
      const days=d.daily.time.map((date,i)=>{const dt=new Date(date);return{
        day:dt.toLocaleDateString('en-GB',{weekday:'short'})+' '+dt.getDate(),date,
        icon:wIcon(d.daily.weather_code[i]),high:Math.round(d.daily.temperature_2m_max[i]),
        low:Math.round(d.daily.temperature_2m_min[i]),rain:d.daily.precipitation_probability_max[i]||0,
        wind:Math.round(d.daily.wind_speed_10m_max[i]*0.621371),summary:wDesc(d.daily.weather_code[i]),
      };});
      setWeather(days);setFetchTime(new Date());
    }catch(e){console.error('Weather error',e);}};
    go();const iv=setInterval(go,3600000);return()=>clearInterval(iv);
  },[]);
  return{weather,fetchTime};
}

/* ──── LIVE GOING HOOK ──── */
function useLiveGoing(){
  const[going,setGoing]=useState(null);
  const[fetchTime,setFetchTime]=useState(null);
  const[status,setStatus]=useState('loading'); // loading | live | unavailable
  useEffect(()=>{
    const go=async()=>{try{
      const r=await fetch('/api/going');
      if(!r.ok)throw new Error();
      const d=await r.json();
      if(d.success&&d.data&&d.data.courses&&d.data.courses.length>0){
        setGoing(d.data);setStatus('live');
      }else{
        setStatus('unavailable');
      }
      setFetchTime(new Date());
    }catch(e){console.error('Going API error',e);setStatus('unavailable');setFetchTime(new Date());}};
    go();const iv=setInterval(go,3600000);return()=>clearInterval(iv);
  },[]);
  return{going,fetchTime,status};
}

/* ──── COMING SOON PLACEHOLDER ──── */
function ComingSoon({title,message}){
  return(
    <div style={{background:C.coolGrad,border:`2px dashed ${C.accent}40`,borderRadius:14,padding:'40px 28px',textAlign:'center',marginBottom:20}}>
      <div style={{fontSize:40,marginBottom:16}}>🔜</div>
      <div style={{fontSize:18,fontWeight:700,color:C.accent,marginBottom:8}}>{title||'Coming Soon'}</div>
      <div style={{fontSize:14,color:C.textMid,lineHeight:1.7,maxWidth:500,margin:'0 auto'}}>
        {message||'Official going reports are typically published 6 days before racing. Data will appear here automatically once Cheltenham begins reporting — expected around March 4th.'}
      </div>
      <div style={{marginTop:16,fontSize:12,color:C.textDim,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
        <span style={{width:8,height:8,borderRadius:'50%',background:C.accent,display:'inline-block',animation:'pulse 2s infinite'}}></span>
        Checking hourly for updates
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  );
}

export default function App(){
  const[tab,setTab]=useState('overview');
  const[raceDay,setRaceDay]=useState(1);
  const[predDay,setPredDay]=useState(1);
  const[cd,setCd]=useState(getCountdown());
  const{weather:liveW,fetchTime:wTime}=useLiveWeather();
  const{going:liveGoing,fetchTime:gTime,status:goingStatus}=useLiveGoing();
  useEffect(()=>{const t=setInterval(()=>setCd(getCountdown()),60000);return()=>clearInterval(t);},[]);

  const shortW=liveW?liveW.slice(0,7):null;
  const festW=liveW?liveW.filter(d=>d.date>='2026-03-10'&&d.date<='2026-03-13'):null;
  const goingData=liveGoing&&liveGoing.courses&&liveGoing.courses.length>0?liveGoing:null;
  const tabs=[{id:'overview',label:'Going Report'},{id:'predictions',label:'Day Predictions'},{id:'weather',label:'Weather'},{id:'chart',label:'Going Trend'},{id:'course',label:'Course Map'},{id:'guide',label:'Going Guide'},{id:'races',label:'Racecard'}];

  return(
    <div style={{fontFamily:font,background:C.bg,color:C.text,minHeight:'100vh'}}>

    {/* HEADER */}
    <header style={{background:C.heroGrad,padding:'30px 0 26px',boxShadow:'0 2px 12px rgba(0,0,0,0.15)'}}>
      <div style={{maxWidth:1120,margin:'0 auto',padding:'0 20px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:800,color:'#fff',margin:0,letterSpacing:'-0.5px'}}>🏇 Cheltenham Festival 2026</h1>
          <p style={{fontSize:14,color:'rgba(255,255,255,0.7)',margin:'4px 0 0'}}>Going & Weather Tracker — Updated Hourly</p>
        </div>
        <div style={{textAlign:'right'}}>
          {cd.days>0?(<>
            <div style={{fontSize:32,fontWeight:800,fontFamily:mono,color:'#fff',lineHeight:1}}>
              {cd.days}<span style={{fontSize:16,color:'rgba(255,255,255,0.6)'}}>d </span>
              {cd.hours}<span style={{fontSize:16,color:'rgba(255,255,255,0.6)'}}>h</span>
            </div>
            <div style={{fontSize:11,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:'1px',marginTop:2}}>{cd.label}</div>
          </>):(<div style={{fontSize:20,fontWeight:800,color:'#6ee7b7'}}>🟢 {cd.label}</div>)}
        </div>
      </div>
    </header>

    <div style={{maxWidth:1120,margin:'0 auto',padding:'24px 20px 60px'}}>

    {/* TABS */}
    <div style={{display:'flex',gap:4,marginBottom:24,borderBottom:`1px solid ${C.border}`,flexWrap:'wrap',overflowX:'auto'}}>
      {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{
        padding:'12px 16px',fontSize:13,fontWeight:600,cursor:'pointer',border:'none',background:'transparent',fontFamily:font,
        color:tab===t.id?C.accent:C.textDim,borderBottom:tab===t.id?`2px solid ${C.accent}`:'2px solid transparent',
        transition:'all 0.15s',marginBottom:-1,whiteSpace:'nowrap',
      }}>{t.label}</button>)}
    </div>

    {/* ══════ OVERVIEW ══════ */}
    {tab==='overview'&&(<>
      {goingData?(
        <Card gradient={C.coolGrad}>
          <CardTitle icon="📋" right={<><span style={{width:8,height:8,borderRadius:'50%',background:C.green,display:'inline-block',marginRight:4}}></span>Live · {goingData.source} · {gTime&&gTime.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}</>}>Current Going Report</CardTitle>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
            {goingData.courses.map((c,i)=>(
              <div key={i} style={{background:getGoingBg(c.going),border:`1px solid ${C.border}`,borderRadius:12,padding:22,textAlign:'center'}}>
                <div style={{fontSize:12,fontWeight:700,color:C.textDim,textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:10}}>{c.name}</div>
                <div style={{fontSize:28,fontWeight:800,color:getGoingColour(c.going),marginBottom:4}}>{c.going}</div>
                {c.detail&&<div style={{fontSize:13,color:C.textMid,marginBottom:12}}>{c.detail}</div>}
                {c.goingStick&&(<>
                  <div style={{fontFamily:mono,fontSize:18,fontWeight:700,color:getStickColour(c.goingStick)}}>{c.goingStick.toFixed(1)}</div>
                  <div style={{fontSize:11,color:C.textDim,marginTop:2}}>GoingStick Reading</div>
                </>)}
              </div>
            ))}
          </div>
        </Card>
      ):(
        <ComingSoon
          title="Going Report — Awaiting Official Data"
          message="Cheltenham's Clerk of the Course publishes official going reports approximately 6 days before racing. For the 2026 Festival (March 10–13), expect the first report around March 4th. This tracker checks every hour and will display live data automatically as soon as it becomes available."
        />
      )}

      <Card>
        <CardTitle icon="🔭" right={`Updated ${GOING_OUTLOOK.updated}`}>Going Outlook</CardTitle>
        <p style={{fontSize:15,lineHeight:1.8,color:C.textMid,marginTop:0,marginBottom:16}}>{GOING_OUTLOOK.summary}</p>
        <div style={{background:C.accentLt,borderLeft:`3px solid ${C.accent}`,borderRadius:'0 10px 10px 0',padding:18,marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,color:C.accent,textTransform:'uppercase',letterSpacing:'1px',marginBottom:6}}>Festival Going Prediction</div>
          <p style={{fontSize:15,lineHeight:1.8,color:C.text,margin:0,fontWeight:500}}>{GOING_OUTLOOK.prediction}</p>
        </div>
        <ul style={{listStyle:'none',padding:0,margin:0}}>{GOING_OUTLOOK.keyFactors.map((f,i)=>(
          <li key={i} style={{fontSize:14,color:C.textMid,padding:'8px 0',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'flex-start',gap:10,lineHeight:1.5}}>
            <span style={{color:C.accent,fontWeight:700,flexShrink:0}}>▸</span><span>{f}</span>
          </li>
        ))}</ul>
      </Card>
      <Card gradient={C.warmGrad}>
        <CardTitle icon="🚧">Rail Movements</CardTitle>
        {RAIL_MOVEMENTS.map((r,i)=>(<div key={i} style={{padding:'12px 0',borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:4}}>{r.date}</div>
          <div style={{fontSize:14,color:C.textMid,lineHeight:1.6}}>{r.detail}</div>
        </div>))}
      </Card>
    </>)}

    {/* ══════ DAY PREDICTIONS ══════ */}
    {tab==='predictions'&&(<>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {DAY_PREDICTIONS.map(d=><Pill key={d.day} active={predDay===d.day} onClick={()=>setPredDay(d.day)}>Day {d.day} — {d.name}</Pill>)}
      </div>
      {(()=>{const p=DAY_PREDICTIONS.find(d=>d.day===predDay);if(!p)return null;return(<>
        <Card gradient={C.coolGrad}>
          <CardTitle icon="🎯" right={`${p.course} · ${p.date}`}>Day {p.day} — {p.name}</CardTitle>
          <div style={{display:'flex',gap:16,marginBottom:24,flexWrap:'wrap'}}>
            <div style={{background:getGoingBg(p.predictedGoing),border:`1px solid ${C.border}`,borderRadius:12,padding:22,textAlign:'center',flex:'1 1 200px',minWidth:180}}>
              <div style={{fontSize:11,fontWeight:700,color:C.textDim,textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:8}}>Predicted Going</div>
              <div style={{fontSize:34,fontWeight:800,color:getGoingColour(p.predictedGoing)}}>{p.predictedGoing}</div>
              <div style={{fontSize:13,color:C.textMid,marginTop:4}}>{p.predictedDetail}</div>
            </div>
            <div style={{background:C.cardAlt,border:`1px solid ${C.border}`,borderRadius:12,padding:22,textAlign:'center',flex:'1 1 140px',minWidth:130}}>
              <div style={{fontSize:11,fontWeight:700,color:C.textDim,textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:8}}>GoingStick Range</div>
              <div style={{fontFamily:mono,fontSize:26,fontWeight:700,color:C.accent,marginTop:6}}>{p.goingStickRange}</div>
            </div>
            <div style={{background:C.cardAlt,border:`1px solid ${C.border}`,borderRadius:12,padding:22,textAlign:'center',flex:'1 1 140px',minWidth:130}}>
              <div style={{fontSize:11,fontWeight:700,color:C.textDim,textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:8}}>Confidence</div>
              <div style={{fontSize:26,fontWeight:700,marginTop:6,color:p.confidence==='High'?C.green:p.confidence==='Medium'?'#ca8a04':C.orange}}>{p.confidence}</div>
            </div>
          </div>
          <div style={{background:C.accentLt,borderLeft:`3px solid ${C.accent}`,borderRadius:'0 10px 10px 0',padding:18}}>
            <div style={{fontSize:11,fontWeight:700,color:C.accent,textTransform:'uppercase',letterSpacing:'1px',marginBottom:6}}>Ground Analysis</div>
            <p style={{fontSize:15,lineHeight:1.8,color:C.text,margin:0}}>{p.analysis}</p>
          </div>
        </Card>
        <Card gradient={C.warmGrad}>
          <CardTitle icon="💡">Race-by-Race Going Impact</CardTitle>
          {p.impactNotes.map((note,i)=>{const[rn,...rest]=note.split(':');return(
            <div key={i} style={{padding:'16px 0',borderBottom:i<p.impactNotes.length-1?`1px solid ${C.border}`:'none'}}>
              <div style={{fontSize:14,fontWeight:700,color:C.accent,marginBottom:6}}>{rn}</div>
              <div style={{fontSize:14,color:C.textMid,lineHeight:1.7}}>{rest.join(':')}</div>
            </div>
          );})}
        </Card>
      </>);})()}
    </>)}

    {/* ══════ WEATHER (LIVE) ══════ */}
    {tab==='weather'&&(<>
      <Card gradient={C.blueGrad}>
        <CardTitle icon="🌤️" right={wTime?<><span style={{width:8,height:8,borderRadius:'50%',background:C.green,display:'inline-block',marginRight:4}}></span>{'Live · Updated '+wTime.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})+' · Refreshes hourly'}</>:'Loading...'}>7-Day Forecast — Cheltenham</CardTitle>
        {shortW?(<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(115px,1fr))',gap:10}}>
          {shortW.map((w,i)=>(<div key={i} style={{background:'rgba(255,255,255,0.7)',border:`1px solid ${C.border}`,borderRadius:10,padding:'16px 10px',textAlign:'center'}}>
            <div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>{w.day}</div>
            <div style={{fontSize:30,marginBottom:4}}>{w.icon}</div>
            <div style={{fontSize:18,fontWeight:700,color:C.text}}>{w.high}°</div>
            <div style={{fontSize:12,color:C.textDim}}>{w.low}° low</div>
            <div style={{fontSize:12,color:C.blue,marginTop:6,fontWeight:600}}>💧 {w.rain}%</div>
            <div style={{fontSize:11,color:C.textDim,marginTop:2}}>💨 {w.wind}mph</div>
          </div>))}
        </div>):(<div style={{textAlign:'center',padding:40,color:C.textDim}}>Loading live weather data...</div>)}
      </Card>

      {festW&&festW.length>0?(
        <Card gradient={C.warmGrad}>
          <CardTitle icon="🎪" right={<><span style={{width:8,height:8,borderRadius:'50%',background:C.green,display:'inline-block',marginRight:4}}></span>Live from Open-Meteo</>}>Festival Week Forecast</CardTitle>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14}}>
            {festW.map((f,i)=>{const dayInfo=FESTIVAL_DAYS[i];return(<div key={i} style={{background:'rgba(255,255,255,0.7)',border:`1px solid ${C.border}`,borderRadius:12,padding:20,textAlign:'center',position:'relative'}}>
              {dayInfo&&<span style={{position:'absolute',top:10,right:10,fontSize:10,fontWeight:700,background:C.accentLt,color:C.accent,padding:'3px 8px',borderRadius:100}}>Day {i+1}</span>}
              <div style={{fontSize:12,fontWeight:600,color:C.textDim,marginBottom:4}}>{f.day}</div>
              {dayInfo&&<div style={{fontSize:15,fontWeight:700,color:C.accent,marginBottom:10}}>{dayInfo.name}</div>}
              <div style={{fontSize:34,marginBottom:6}}>{f.icon}</div>
              <div style={{fontSize:18,fontWeight:700,color:C.text}}>{f.high}° / {f.low}°</div>
              <div style={{fontSize:13,color:C.textMid,marginTop:4}}>{f.summary}</div>
              <div style={{fontSize:12,color:C.blue,marginTop:6,fontWeight:600}}>💧 {f.rain}%</div>
              <div style={{fontSize:11,color:C.textDim,marginTop:2}}>💨 {f.wind}mph</div>
            </div>);})}
          </div>
        </Card>
      ):(
        <Card>
          <CardTitle icon="🎪" right="⚠️ Long range — low confidence">Festival Week Forecast (Static)</CardTitle>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14}}>
            {FESTIVAL_FORECAST.map((f,i)=>(<div key={i} style={{background:C.cardAlt,border:`1px solid ${C.border}`,borderRadius:12,padding:20,textAlign:'center',position:'relative'}}>
              <span style={{position:'absolute',top:10,right:10,fontSize:10,fontWeight:700,background:C.accentLt,color:C.accent,padding:'3px 8px',borderRadius:100}}>Day {i+1}</span>
              <div style={{fontSize:12,fontWeight:600,color:C.textDim,marginBottom:4}}>{f.day}</div>
              <div style={{fontSize:15,fontWeight:700,color:C.accent,marginBottom:10}}>{f.name}</div>
              <div style={{fontSize:34,marginBottom:6}}>{f.icon}</div>
              <div style={{fontSize:18,fontWeight:700,color:C.text}}>{f.high}° / {f.low}°</div>
              <div style={{fontSize:13,color:C.textDim,marginTop:4}}>{f.summary}</div>
              <div style={{fontSize:12,color:C.blue,marginTop:6,fontWeight:600}}>💧 {f.rain}%</div>
            </div>))}
          </div>
        </Card>
      )}

      <Card>
        <CardTitle icon="💧">Rainfall vs Going</CardTitle>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={GOING_HISTORY} margin={{top:10,right:20,left:0,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="date" tick={{fill:C.textDim,fontSize:12}}/>
            <YAxis yAxisId="rain" orientation="right" tick={{fill:C.blue,fontSize:12}}/>
            <YAxis yAxisId="going" domain={[1,5]} tick={{fill:C.textDim,fontSize:11}} tickFormatter={v=>glabel(v)}/>
            <Tooltip content={<GoingTooltip/>}/>
            <Bar yAxisId="rain" dataKey="rainfall" fill={C.rainBar} radius={[4,4,0,0]} name="Rainfall (mm)"/>
            <Line yAxisId="going" type="monotone" dataKey="oldCourse" stroke={C.oldLine} strokeWidth={2} dot={false} name="Old Course"/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>)}

    {/* ══════ CHART ══════ */}
    {tab==='chart'&&(
      <Card>
        <CardTitle icon="📈">Going Trend — All Courses</CardTitle>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={GOING_HISTORY} margin={{top:10,right:20,left:10,bottom:5}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="date" tick={{fill:C.textDim,fontSize:12}}/>
            <YAxis domain={[1,5]} tick={{fill:C.textDim,fontSize:11}} tickFormatter={v=>glabel(v)} width={60}/>
            <Tooltip content={<GoingTooltip/>}/>
            <Legend wrapperStyle={{fontSize:12}} iconType="line"/>
            <ReferenceLine y={2} stroke={C.red} strokeDasharray="5 5" label={{value:'Soft',fill:C.red,fontSize:11,position:'left'}}/>
            <ReferenceLine y={4} stroke={C.green} strokeDasharray="5 5" label={{value:'Good',fill:C.green,fontSize:11,position:'left'}}/>
            <Line type="monotone" dataKey="oldCourse" stroke={C.oldLine} strokeWidth={3} dot={{r:4,fill:C.oldLine}} name="Old Course"/>
            <Line type="monotone" dataKey="newCourse" stroke={C.newLine} strokeWidth={3} dot={{r:4,fill:C.newLine}} name="New Course"/>
            <Line type="monotone" dataKey="crossCountry" stroke={C.ccLine} strokeWidth={3} dot={{r:4,fill:C.ccLine}} name="Cross Country"/>
          </LineChart>
        </ResponsiveContainer>
        <div style={{marginTop:16,padding:'14px 18px',background:C.accentLt,borderRadius:10,fontSize:13,color:C.textMid,lineHeight:1.6}}>
          <strong style={{color:C.accent}}>How to read:</strong> Lower values = softer ground. Red line = Soft, green = Good. All three courses trending softer through February.
        </div>
      </Card>
    )}

    {/* ══════ COURSE MAP ══════ */}
    {tab==='course'&&(<>
      <Card gradient={C.coolGrad}>
        <CardTitle icon="🗺️">Cheltenham Racecourse — Course Map</CardTitle>
        <div style={{borderRadius:12,overflow:'hidden',border:`1px solid ${C.border}`,marginBottom:20,maxWidth:'70%',margin:'0 auto 20px'}}>
          <img src="/track-map.png" alt="Cheltenham Racecourse Map" style={{width:'100%',height:'auto',display:'block'}}/>
        </div>
        <p style={{fontSize:14,color:C.textMid,lineHeight:1.7,margin:'0 0 8px',textAlign:'center'}}>
          Both Old Course (Days 1 & 3) and New Course (Days 2 & 4) shown with start positions. Red markers = start gates. The course runs <strong>left-handed</strong> with the famous uphill finish.
        </p>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(420px,1fr))',gap:20}}>
        {[TRACK_FEATURES.oldCourse,TRACK_FEATURES.newCourse].map((course,ci)=>(
          <Card key={ci} gradient={ci===0?C.warmGrad:C.coolGrad}>
            <CardTitle icon={ci===0?'🟡':'🟢'}>{course.name}</CardTitle>
            <p style={{fontSize:14,color:C.textMid,lineHeight:1.7,marginTop:0,marginBottom:16}}>{course.description}</p>
            {course.keyFeatures.map((f,i)=>(
              <div key={i} style={{padding:'12px 0',borderBottom:`1px solid ${C.border}`}}>
                <div style={{fontSize:13,fontWeight:700,color:C.accent,marginBottom:4}}>{f.name}</div>
                <div style={{fontSize:13,color:C.textMid,lineHeight:1.6}}>{f.desc}</div>
              </div>
            ))}
          </Card>
        ))}
      </div>
      <Card style={{background:C.accentLt,border:`1px solid rgba(15,118,110,0.15)`}}>
        <CardTitle icon="💧">Drainage Notes</CardTitle>
        <p style={{fontSize:14,color:C.textMid,lineHeight:1.7,margin:0}}>{TRACK_FEATURES.drainageNotes}</p>
      </Card>
    </>)}

    {/* ══════ GOING GUIDE ══════ */}
    {tab==='guide'&&(<>
      <Card gradient={C.coolGrad}>
        <CardTitle icon="📖">Understanding the Going</CardTitle>
        <p style={{fontSize:15,color:C.textMid,lineHeight:1.8,marginTop:0,marginBottom:20}}>
          The "going" describes ground conditions and is one of the most critical factors in horse racing. It affects race times, jumping accuracy, stamina requirements, and which horses perform best.
        </p>
        <GoingScaleBar/>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:C.textDim,marginBottom:4,padding:'0 4px',fontWeight:500}}>
          <span>← Softer (more demanding)</span><span>Faster (less demanding) →</span>
        </div>
      </Card>
      {GOING_GUIDE.map((g,i)=>(
        <Card key={i} style={{borderLeft:`4px solid ${g.colour}`,borderRadius:'0 16px 16px 0'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
            <div style={{fontSize:22,fontWeight:800,color:g.colour}}>{g.name}</div>
            <div style={{fontFamily:mono,fontSize:12,color:C.textDim,background:C.cardAlt,padding:'5px 12px',borderRadius:100,border:`1px solid ${C.border}`}}>GoingStick: {g.goingStick}</div>
          </div>
          <p style={{fontSize:14,color:C.text,lineHeight:1.8,marginTop:0,marginBottom:14}}>{g.description}</p>
          <div style={{background:C.cardAlt,borderLeft:`3px solid ${g.colour}`,borderRadius:'0 10px 10px 0',padding:16,marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:g.colour,textTransform:'uppercase',letterSpacing:'1px',marginBottom:6}}>Impact on Racing</div>
            <p style={{fontSize:14,color:C.textMid,lineHeight:1.7,margin:0}}>{g.impact}</p>
          </div>
          <div style={{fontSize:12,color:C.textDim,fontStyle:'italic'}}>Visual: {g.visualDesc}</div>
        </Card>
      ))}
    </>)}

    {/* ══════ RACES ══════ */}
    {tab==='races'&&(<>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {FESTIVAL_DAYS.map(d=><Pill key={d.day} active={raceDay===d.day} onClick={()=>setRaceDay(d.day)}>Day {d.day} — {d.name}</Pill>)}
      </div>
      <Card>
        <CardTitle icon="🏆" right={`${FESTIVAL_DAYS[raceDay-1].course} · ${FESTIVAL_DAYS[raceDay-1].date}`}>{FESTIVAL_DAYS[raceDay-1].name}</CardTitle>
        {KEY_RACES.find(r=>r.day===raceDay)?.races.map((race,i)=>{const gc=gradeStyle(race.grade);return(
          <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 0',borderBottom:`1px solid ${C.border}`,flexWrap:'wrap'}}>
            <span style={{fontFamily:mono,fontWeight:600,color:C.accent,minWidth:50,fontSize:13}}>{race.time}</span>
            <span style={{flex:1,fontWeight:600,fontSize:14,minWidth:180,color:C.text}}>{race.name}</span>
            <span style={{fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:100,background:gc.bg,color:gc.color}}>{race.grade}</span>
            <span style={{fontSize:12,color:C.textDim,minWidth:90,textAlign:'right'}}>{race.distance} · {race.surface}</span>
          </div>
        );})}
      </Card>
    </>)}

    {/* FOOTER */}
    <div style={{fontSize:12,color:C.textDim,textAlign:'center',marginTop:40,padding:'16px 0',borderTop:`1px solid ${C.border}`}}>
      Going: {goingStatus==='live'?'🟢 Live':'🔜 Awaiting official reports'} · Weather: 🟢 Live (Open-Meteo, hourly) · Going data from Jockey Club / TurfTrax
    </div>

    </div>
    </div>
  );
}
