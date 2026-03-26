import { useState, useRef } from "react";

const CHIPS = [
  { label:"🌸 親子沖繩", text:"11大3小 6/10-14 去沖繩 不租車 放鬆" },
  { label:"🗼 東京自由行", text:"2大人 9/5-9 東京 美食購物 自由行" },
  { label:"❄️ 北海道賞雪", text:"情侶 12/20-25 北海道 賞雪泡湯" },
  { label:"🌴 峇里島度假", text:"4大人 7/1-5 峇里島 度假 SPA" },
];

const DAY_COLORS = [
  { hd:"#1565C0", badge:"#FF6F00" },
  { hd:"#2E7D32", badge:"#E53935" },
  { hd:"#6A1B9A", badge:"#F57C00" },
  { hd:"#AD1457", badge:"#00838F" },
  { hd:"#00695C", badge:"#C62828" },
];

const INFO_META = {
  outbound:{ title:"✈️ 編輯去程班機", color:"#1565C0", bg:"#E3F2FD", icon:"✈️", lbl:"去程班機",
    fields:[["airline","航空公司"],["flightNo","班號"],["from","出發地"],["to","目的地"],["departure","出發時間"],["arrival","抵達時間"],["price","票價"]] },
  return:  { title:"🛬 編輯回程班機", color:"#6A1B9A", bg:"#F3E5F5", icon:"🛬", lbl:"回程班機",
    fields:[["airline","航空公司"],["flightNo","班號"],["from","出發地"],["to","目的地"],["departure","出發時間"],["arrival","抵達時間"],["price","票價"]] },
  transfer:{ title:"🚌 編輯機場接送", color:"#2E7D32", bg:"#E8F5E9", icon:"🚌", lbl:"機場接送",
    fields:[["type","交通方式"],["detail","說明"],["price","費用"]] },
  hotel:   { title:"🏨 編輯住宿",    color:"#AD1457", bg:"#FCE4EC", icon:"🏨", lbl:"住宿",
    fields:[["name","飯店名稱"],["location","地點"],["roomType","房型"],["nights","晚數"],["pricePerNight","每晚價格"],["mapUrl","Google Maps 網址（貼入）"]] },
};

// ── Google Maps 網址工具 ─────────────────────────────────
function normalizeMapUrl(val) {
  if (!val) return null;
  // 已經是完整 URL
  if (val.startsWith("http")) return val;
  // 關鍵字 fallback（舊資料）
  return `https://www.google.com/maps/search/${encodeURIComponent(val)}`;
}

const MOCK = {
  title:"沖繩親子放鬆之旅 5天4夜", destination:"日本・沖繩 🌺",
  dates:"6/10 (二) – 6/14 (六)", travelers:"大人 1 名 + 小孩 3 名",
  theme:"海灘放鬆 × 親子體驗 × 在地美食",
  flight:{
    outbound:{ airline:"台灣虎航", flightNo:"IT201", from:"桃園 TPE", to:"那霸 OKA", departure:"07:30", arrival:"10:45", price:"約 NT$3,800／人" },
    return:  { airline:"台灣虎航", flightNo:"IT202", from:"那霸 OKA", to:"桃園 TPE", departure:"17:00", arrival:"18:30", price:"約 NT$3,800／人" },
  },
  transfer:{ type:"那霸巴士＋單軌電車", detail:"機場利木津巴士到市區，沿途搭 Yui-Rail 輕鬆移動，無需租車", price:"約 ¥1,200／趟" },
  hotel:{ name:"琉球温泉 瀬長島ホテル", location:"豐見城市・瀨長島", roomType:"家庭房 (2大2小)", nights:4, pricePerNight:"約 NT$6,500",
    mapUrl:"https://maps.app.goo.gl/example" }, // 使用者會貼入正確連結
  days:[
    { day:1, date:"6/10 (二)", title:"抵達那霸・國際通散策", activities:[
      { time:"10:45", icon:"✈️", name:"抵達那霸空港", desc:"入境後搭利木津巴士前往市區，約 40 分鐘。", mapUrl:"https://maps.app.goo.gl/NahaAirport" },
      { time:"12:30", icon:"🍜", name:"午餐：富士家沖繩そば", desc:"在地老店，招牌三枚肉そば湯頭清甜，小孩也愛。", mapUrl:"" },
      { time:"14:30", icon:"🛍️", name:"國際通逛街購物", desc:"那霸最熱鬧的商店街，伴手禮、冰淇淋一次搞定。", mapUrl:"" },
      { time:"16:30", icon:"🏯", name:"壺屋陶器街", desc:"傳統琉球陶器聚集地，手作體驗適合親子同樂。", mapUrl:"" },
      { time:"18:30", icon:"🍦", name:"Blue Seal 冰淇淋", desc:"沖繩在地品牌，紫芋口味必點，孩子最愛。", mapUrl:"" },
      { time:"20:00", icon:"🏨", name:"Check-in 飯店", desc:"搭巴士前往瀨長島，辦理入住，休息備戰。", mapUrl:"" },
    ]},
    { day:2, date:"6/11 (三)", title:"海洋博公園・水族館", activities:[
      { time:"09:00", icon:"🚌", name:"包車前往本部町", desc:"距那霸約 2 小時，安排包車最輕鬆。", mapUrl:"" },
      { time:"11:00", icon:"🐋", name:"沖繩美麗海水族館", desc:"全球最大水槽之一，鯨鯊近在眼前，孩子尖叫保證。", mapUrl:"" },
      { time:"13:00", icon:"🍱", name:"海洋博公園內餐廳", desc:"俯瞰大海邊用餐，點招牌海鮮丼或沖繩定食。", mapUrl:"" },
      { time:"14:30", icon:"🐬", name:"海豚表演 & 海牛館", desc:"免費海豚秀每天多場，海牛館小孩超著迷。", mapUrl:"" },
      { time:"16:30", icon:"🌺", name:"備瀨福木林道散步", desc:"百年福木隧道，光影夢幻，推嬰兒車也好走。", mapUrl:"" },
      { time:"19:00", icon:"🍺", name:"晚餐：岸本食堂", desc:"在地人推薦的沖繩家庭食堂，份量大價格親民。", mapUrl:"" },
    ]},
    { day:3, date:"6/12 (四)", title:"瀨長島・豐崎海灘", activities:[
      { time:"08:30", icon:"🌅", name:"瀨長島海邊晨走", desc:"飯店前就是海景步道，清晨最舒服。", mapUrl:"" },
      { time:"10:00", icon:"🛍️", name:"Umikaji Terrace", desc:"地中海風白色建築群，咖啡、甜點、手作雜貨。", mapUrl:"" },
      { time:"12:00", icon:"🍔", name:"午餐：Jackpot Burger", desc:"島內人氣漢堡，料多實在，海景座位超放鬆。", mapUrl:"" },
      { time:"14:00", icon:"🏖️", name:"豐崎 美らSUNビーチ", desc:"人工海灘水淺乾淨，適合小孩玩水踩浪，免費入場。", mapUrl:"" },
      { time:"17:00", icon:"🚿", name:"回飯店梳洗放鬆", desc:"沖澡後在飯店泳池再玩一輪。", mapUrl:"" },
      { time:"19:00", icon:"🥩", name:"晚餐：琉球的牛 燒肉", desc:"沖繩和牛燒肉，肉質軟嫩，孩子也能吃的大份套餐。", mapUrl:"" },
    ]},
    { day:4, date:"6/13 (五)", title:"首里城・波上宮・牧志市場", activities:[
      { time:"09:00", icon:"🏯", name:"首里城公園", desc:"琉球王國歷史遺址，紅色城牆壯觀。", mapUrl:"" },
      { time:"11:30", icon:"⛩️", name:"波上宮參拜", desc:"沖繩最古老神社，面海而建，景色開闊。", mapUrl:"" },
      { time:"12:30", icon:"🐟", name:"第一牧志公設市場", desc:"那霸最熱鬧的傳統市場，2樓可帶食材請店家料理。", mapUrl:"" },
      { time:"14:30", icon:"🧁", name:"Portriver Market 下午茶", desc:"老倉庫改裝咖啡廳，手工甜點搭配紅芋拿鐵超療癒。", mapUrl:"" },
      { time:"16:00", icon:"🎮", name:"孩子玩耍時間", desc:"讓孩子在廣場跑跳，大人喝咖啡放空。", mapUrl:"" },
      { time:"19:00", icon:"🍣", name:"晚餐：魚まさ 居酒屋", desc:"新鮮刺身、炙燒干貝，沖繩最後一晚必吃海鮮。", mapUrl:"" },
    ]},
    { day:5, date:"6/14 (六)", title:"購物掃貨・返台", activities:[
      { time:"09:00", icon:"🛒", name:"AEON MALL 那覇 掃貨", desc:"藥妝、食品、玩具一次買齊，退稅方便。", mapUrl:"" },
      { time:"12:00", icon:"🍔", name:"午餐：A&W 漢堡", desc:"沖繩限定速食，Root Beer + 起司漢堡。", mapUrl:"" },
      { time:"13:30", icon:"🚌", name:"前往那霸空港", desc:"利木津巴士約 40 分，建議提早 2 小時到機場。", mapUrl:"" },
      { time:"17:00", icon:"✈️", name:"IT202 返台", desc:"那霸出發，桃園降落約 18:30，結束美好沖繩行！", mapUrl:"" },
    ]},
  ],
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Noto+Sans+TC:wght@400;500;700&display=swap');
  @keyframes fly    { from{transform:translateX(-16px) rotate(-8deg)} to{transform:translateX(16px) rotate(8deg)} }
  @keyframes pop    { 0%{transform:scale(.88);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes fadeUp { from{transform:translateY(14px);opacity:0} to{transform:translateY(0);opacity:1} }
  *{box-sizing:border-box;margin:0;padding:0;}
  textarea:focus,input:focus{outline:none;}
  textarea::placeholder,input::placeholder{color:#aaa;}
  .chip:hover{background:#1565C0!important;color:#fff!important;transform:scale(1.05);}
  .chip{transition:all .16s;}
  .go-btn:hover{transform:scale(1.04) translateY(-1px);box-shadow:0 6px 20px rgba(255,111,0,.4)!important;}
  .go-btn{transition:all .18s;}
  .act-row:hover{background:#FFF8E1!important;}
  .act-row:hover .act-ctrls{opacity:1!important;}
  .map-btn:hover{background:#1565C0!important;color:#fff!important;}
  .map-btn{transition:all .15s;}
  .add-act-btn:hover{border-color:#FF6F00!important;color:#FF6F00!important;background:#FFF8E1!important;}
  .add-day-btn:hover{border-color:#1565C0!important;color:#1565C0!important;background:#E3F2FD!important;}
  .bar-btn:hover{background:#E3F2FD!important;color:#1565C0!important;}
  .dab-btn:hover{background:rgba(255,255,255,.3)!important;}
  .info-edit-btn{opacity:0;transition:opacity .15s;}
  .info-card:hover .info-edit-btn{opacity:1;}
  .info-card{transition:box-shadow .18s,transform .18s;}
  .info-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.1)!important;}
  .act-row.drag-over{border:2px dashed #FFD600!important;background:#FFFDE7!important;}
`;

export default function PlanJ() {
  const [query,setQuery]         = useState("");
  const [loading,setLoading]     = useState(false);
  const [trip,setTrip]           = useState(null);
  const [collapsed,setCollapsed] = useState({});
  const [modal,setModal]         = useState(null);
  const [form,setForm]           = useState({});
  const [infoModal,setInfoModal] = useState(null);
  const [infoForm,setInfoForm]   = useState({});
  const [dragOver,setDragOver]   = useState(null); // {di,ai}
  const [toast,setToast]         = useState("");
  const toastRef  = useRef(null);
  const dragSrc   = useRef(null);
  const resultRef = useRef(null);

  function showToast(msg){ setToast(msg); clearTimeout(toastRef.current); toastRef.current=setTimeout(()=>setToast(""),2400); }
  function updateTrip(fn){ setTrip(p=>{ const t=JSON.parse(JSON.stringify(p)); fn(t); return t; }); }

  // ── generate
  async function generate(){
    if(!query.trim()){ showToast("請輸入旅遊需求 ✈️"); return; }
    setLoading(true); setTrip(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) { showToast("規劃失敗：" + data.error); setLoading(false); return; }
      setTrip(data.trip); setCollapsed({}); setLoading(false);
    } catch(e) {
      showToast("網路錯誤，請重試"); setLoading(false);
    }
    setTimeout(()=>resultRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
  }

  // ── activity modal
  function openModal(di,ai){
    const a=trip.days[di].activities[ai]||{};
    setForm({time:a.time||"",icon:a.icon||"",name:a.name||"",desc:a.desc||"",mapUrl:a.mapUrl||""});
    setModal({di,ai});
  }
  function saveModal(){
    updateTrip(t=>Object.assign(t.days[modal.di].activities[modal.ai],form));
    setModal(null); showToast("已儲存 ✅");
  }

  // ── info modal
  function openInfoModal(key){
    const src = key==="outbound"?trip.flight?.outbound:key==="return"?trip.flight?.return:key==="transfer"?trip.transfer:trip.hotel;
    setInfoForm({...(src||{})});
    setInfoModal(key);
  }
  function saveInfoModal(){
    updateTrip(t=>{
      if(infoModal==="outbound") Object.assign(t.flight.outbound,infoForm);
      else if(infoModal==="return") Object.assign(t.flight.return,infoForm);
      else if(infoModal==="transfer") Object.assign(t.transfer,infoForm);
      else if(infoModal==="hotel"){ Object.assign(t.hotel,infoForm); t.hotel.nights=Number(infoForm.nights)||t.hotel.nights; }
    });
    setInfoModal(null); showToast("已儲存 ✅");
  }

  // ── CRUD
  function delAct(di,ai){ updateTrip(t=>t.days[di].activities.splice(ai,1)); showToast("已刪除"); }
  function addAct(di){
    updateTrip(t=>t.days[di].activities.push({time:"12:00",icon:"⭐",name:"新活動",desc:"",mapUrl:""}));
    setTimeout(()=>openModal(di,trip.days[di].activities.length),30);
  }
  function delDay(i){
    if(trip.days.length<=1){showToast("至少保留一天！");return;}
    if(!confirm(`確定刪除 Day ${trip.days[i].day}？`))return;
    updateTrip(t=>{t.days.splice(i,1);t.days.forEach((d,j)=>d.day=j+1);}); showToast("已刪除");
  }
  function addDay(){
    updateTrip(t=>{const last=t.days[t.days.length-1]; t.days.push({day:last.day+1,date:"待定",title:"新的一天 🎉",activities:[{time:"09:00",icon:"⭐",name:"新活動",desc:"",mapUrl:""}]});});
    showToast("已新增一天 🎊");
  }
  function editDayTitle(i){const v=prompt("當天主題：",trip.days[i].title);if(v)updateTrip(t=>t.days[i].title=v);}

  // ── drag & drop（拖拉後自動重排時間）
  function onDragStart(e,di,ai){ dragSrc.current={di,ai}; e.dataTransfer.effectAllowed="move"; }
  function onDragOver(e,di,ai){ e.preventDefault(); setDragOver({di,ai}); }
  function onDragLeave(){ setDragOver(null); }
  function onDrop(e,di,ai){
    e.preventDefault(); setDragOver(null);
    const s=dragSrc.current;
    if(!s||(s.di===di&&s.ai===ai))return;
    updateTrip(t=>{
      // 拖拉前先記住每個 day 的時間陣列（時間留在格子上，不跟著活動走）
      const srcTimes = t.days[s.di].activities.map(a=>a.time);
      const dstTimes = t.days[di].activities.map(a=>a.time);

      // 移動活動本身（不含時間）
      const [moved]=t.days[s.di].activities.splice(s.ai,1);
      t.days[di].activities.splice(ai,0,moved);

      // 把原本的時間序列「回填」到新順序的活動上
      t.days[s.di].activities.forEach((a,i)=>{ a.time = srcTimes[i] ?? a.time; });
      if(s.di !== di){
        t.days[di].activities.forEach((a,i)=>{ a.time = dstTimes[i] ?? a.time; });
      }
    });
    showToast("順序已更新 ✨");
  }

  // ── copy
  function copyPlan(){
    if(!trip)return;
    let txt=`${trip.title}\n${trip.dates} · ${trip.travelers}\n\n`;
    trip.days.forEach(d=>{txt+=`【Day ${d.day}】${d.title} (${d.date})\n`;d.activities.forEach(a=>txt+=`  ${a.time} ${a.icon} ${a.name}\n`);txt+="\n";});
    navigator.clipboard.writeText(txt).then(()=>showToast("已複製到剪貼簿 📋"));
  }

  // ── info cards
  function getInfoCards(){
    if(!trip)return[];
    const f=trip.flight,tr=trip.transfer,h=trip.hotel;
    return [
      f?.outbound&&{key:"outbound",...INFO_META.outbound,title:`${f.outbound.airline} ${f.outbound.flightNo}`,lines:[`${f.outbound.from} → ${f.outbound.to}`,`${f.outbound.departure} → ${f.outbound.arrival}`,f.outbound.price]},
      f?.return&&  {key:"return",...INFO_META.return,  title:`${f.return.airline} ${f.return.flightNo}`,    lines:[`${f.return.from} → ${f.return.to}`,`${f.return.departure} → ${f.return.arrival}`,f.return.price]},
      tr&&         {key:"transfer",...INFO_META.transfer,title:tr.type,                                      lines:[tr.detail,tr.price]},
      h&&          {key:"hotel",...INFO_META.hotel,title:h.name,                                             lines:[h.location,h.roomType,`${h.nights}晚 · ${h.pricePerNight}／晚`],mapUrl:h.mapUrl},
    ].filter(Boolean);
  }

  const infoCards=getInfoCards();
  const im=infoModal?INFO_META[infoModal]:null;

  // ── Map URL helper：產出正確連結
  function mapHref(val){
    if(!val)return null;
    if(val.startsWith("http"))return val;
    return `https://www.google.com/maps/search/${encodeURIComponent(val)}`;
  }

  return (
    <div style={{fontFamily:"'Noto Sans TC','Nunito',sans-serif",background:"#F0F7FF",minHeight:"100vh",color:"#1A237E"}}>
      <style>{css}</style>

      {/* NAV */}
      <div style={{background:"linear-gradient(135deg,#1565C0,#0D47A1)",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 4px 12px rgba(21,101,192,.3)"}}>
        <div>
          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:26,fontWeight:900,color:"#fff",letterSpacing:"-0.5px",lineHeight:1}}>
            Plan<span style={{color:"#FFD600"}}>J</span> ✈️
          </div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.65)",letterSpacing:"2px",marginTop:2}}>AI 旅行規劃師</div>
        </div>
        {trip&&!loading&&<div style={{background:"rgba(255,255,255,.15)",color:"#fff",borderRadius:20,padding:"6px 14px",fontSize:13,fontWeight:700}}>{trip.destination}</div>}
      </div>

      {/* SEARCH */}
      <div style={{background:"#fff",borderBottom:"3px solid #FFD600",padding:"24px 20px",boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1565C0",letterSpacing:"1px",textTransform:"uppercase",marginBottom:10}}>🗺️ 輸入你的旅遊需求</div>
          <div style={{background:"#F0F7FF",border:"2.5px solid #90CAF9",borderRadius:20,padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
            <textarea style={{border:"none",background:"transparent",fontFamily:"inherit",fontSize:16,color:"#1A237E",resize:"none",width:"100%",lineHeight:1.6,minHeight:52}}
              rows={2} value={query} onChange={e=>setQuery(e.target.value)}
              placeholder="例：11大3小 6/10-14 去沖繩 不租車 想放鬆，預算每人3萬..."
              onKeyDown={e=>{if(e.key==="Enter"&&(e.metaKey||e.ctrlKey))generate();}} />
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {CHIPS.map(c=>(
                  <button key={c.label} className="chip" onClick={()=>setQuery(c.text)}
                    style={{background:"#E3F2FD",color:"#1565C0",fontSize:13,fontWeight:700,padding:"6px 14px",borderRadius:20,cursor:"pointer",border:"2px solid #90CAF9",fontFamily:"inherit"}}>
                    {c.label}
                  </button>
                ))}
              </div>
              <button className="go-btn" onClick={generate} disabled={loading}
                style={{background:loading?"#ccc":"linear-gradient(135deg,#FF6F00,#FF8F00)",color:"#fff",border:"none",padding:"12px 28px",borderRadius:24,fontSize:16,fontWeight:800,cursor:loading?"not-allowed":"pointer",fontFamily:"'Nunito',inherit",boxShadow:"0 4px 14px rgba(255,111,0,.3)"}}>
                {loading?"規劃中…✨":"規劃行程 🚀"}
              </button>
            </div>
          </div>
          <div style={{fontSize:12,color:"#90A4AE",marginTop:6}}>💡 Cmd / Ctrl + Enter 快速送出</div>
        </div>
      </div>

      {/* LOADING */}
      {loading&&(
        <div style={{textAlign:"center",padding:"70px 20px"}}>
          <div style={{fontSize:44,animation:"fly 1.3s ease-in-out infinite alternate",display:"inline-block",marginBottom:16}}>✈️</div>
          <div style={{fontSize:20,fontWeight:800,color:"#1565C0",marginBottom:8}}>正在規劃最完美的行程…</div>
          <div style={{fontSize:15,color:"#90A4AE"}}>搜尋班機 · 確認住宿 · 安排景點</div>
        </div>
      )}

      {/* RESULT */}
      {trip&&!loading&&(
        <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px 80px"}} ref={resultRef}>

          {/* Trip header */}
          <div style={{background:"linear-gradient(135deg,#1565C0,#283593)",borderRadius:24,padding:"24px 28px",marginBottom:20,boxShadow:"0 6px 20px rgba(21,101,192,.25)",animation:"pop .4s ease"}}>
            <div style={{fontFamily:"'Nunito',sans-serif",fontSize:22,fontWeight:900,color:"#FFD600",marginBottom:10,lineHeight:1.3}}>{trip.title}</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[["📍",trip.destination],["📅",trip.dates],["👥",trip.travelers],["✨",trip.theme]].map(([ic,v],i)=>(
                <span key={i} style={{background:"rgba(255,255,255,.15)",color:"#fff",fontSize:13,fontWeight:700,padding:"5px 12px",borderRadius:20}}>{ic} {v}</span>
              ))}
            </div>
          </div>

          {/* Info cards */}
          <div style={{fontSize:13,fontWeight:800,color:"#1565C0",letterSpacing:"1.5px",textTransform:"uppercase",margin:"0 0 12px"}}>✈️ 交通 & 住宿</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:12,marginBottom:28}}>
            {infoCards.map((c,i)=>(
              <div key={i} className="info-card"
                style={{background:c.bg,border:`2.5px solid ${c.color}30`,borderRadius:18,padding:"16px",position:"relative",animation:`pop .3s ${i*0.07}s ease both`,boxShadow:"0 2px 8px rgba(0,0,0,.06)"}}>
                <button className="info-edit-btn" onClick={()=>openInfoModal(c.key)}
                  style={{position:"absolute",top:10,right:10,background:c.color,color:"#fff",border:"none",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  ✏️ 編輯
                </button>
                <div style={{fontSize:26,marginBottom:6}}>{c.icon}</div>
                <div style={{fontSize:11,fontWeight:800,color:c.color,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>{c.lbl}</div>
                <div style={{fontSize:15,fontWeight:800,color:"#1A237E",marginBottom:4,lineHeight:1.3,paddingRight:52}}>{c.title}</div>
                <div style={{fontSize:13,color:"#546E7A",lineHeight:1.7}}>{c.lines.map((l,j)=><div key={j}>{l}</div>)}</div>
                {c.mapUrl&&mapHref(c.mapUrl)&&(
                  <a className="map-btn" href={mapHref(c.mapUrl)} target="_blank" rel="noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:8,fontSize:12,fontWeight:700,color:c.color,border:`2px solid ${c.color}`,padding:"3px 10px",borderRadius:20,textDecoration:"none"}}>
                    📍 地圖
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Days */}
          <div style={{fontSize:13,fontWeight:800,color:"#1565C0",letterSpacing:"1.5px",textTransform:"uppercase",margin:"0 0 12px"}}>📅 每日行程</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {trip.days.map((day,di)=>{
              const col=DAY_COLORS[di%DAY_COLORS.length];
              return(
                <div key={di} style={{background:"#fff",borderRadius:20,overflow:"hidden",border:`2.5px solid ${col.hd}25`,boxShadow:"0 3px 12px rgba(0,0,0,.07)",animation:"fadeUp .35s ease both"}}>
                  {/* Day header */}
                  <div style={{background:col.hd,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}
                    onClick={()=>setCollapsed(c=>({...c,[di]:!c[di]}))}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{background:col.badge,color:"#fff",fontFamily:"'Nunito',sans-serif",fontSize:13,fontWeight:900,padding:"4px 12px",borderRadius:20,letterSpacing:"1px"}}>Day {day.day}</div>
                      <div>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:17,fontWeight:800,color:"#fff"}}>{day.title}</div>
                        <div style={{fontSize:12,color:"rgba(255,255,255,.65)",marginTop:1}}>{day.date}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6}} onClick={e=>e.stopPropagation()}>
                      <button className="dab-btn" onClick={()=>editDayTitle(di)}
                        style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"4px 10px",fontSize:13,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>✏️</button>
                      <button className="dab-btn" onClick={()=>delDay(di)}
                        style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:8,padding:"4px 10px",fontSize:13,color:"#fff",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🗑️</button>
                      <span style={{color:"rgba(255,255,255,.7)",fontSize:16,marginLeft:4,display:"inline-block",transition:"transform .25s",transform:collapsed[di]?"rotate(-90deg)":"rotate(0)"}}>▾</span>
                    </div>
                  </div>

                  {!collapsed[di]&&(
                    <div style={{padding:"12px 16px"}}>
                      {day.activities.map((act,ai)=>{
                        const isDragOver=dragOver&&dragOver.di===di&&dragOver.ai===ai;
                        return(
                          <div key={ai} className={`act-row${isDragOver?" drag-over":""}`}
                            draggable
                            onDragStart={e=>onDragStart(e,di,ai)}
                            onDragOver={e=>onDragOver(e,di,ai)}
                            onDragLeave={onDragLeave}
                            onDrop={e=>onDrop(e,di,ai)}
                            style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 10px",borderRadius:12,cursor:"grab",border:"2px solid transparent",marginBottom:2,transition:"background .12s"}}>
                            <span style={{color:"#B0BEC5",fontSize:16,cursor:"grab",flexShrink:0,marginTop:3}}>⠿</span>
                            <span style={{fontSize:12,color:col.hd,fontWeight:800,whiteSpace:"nowrap",width:38,flexShrink:0,marginTop:4,fontFamily:"'Nunito',sans-serif"}}>{act.time}</span>
                            <span style={{fontSize:20,flexShrink:0,width:26,textAlign:"center",marginTop:1}}>{act.icon||"📍"}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontWeight:700,fontSize:15,color:"#1A237E",marginBottom:3}}>{act.name}</div>
                              <div style={{fontSize:13,color:"#546E7A",lineHeight:1.55,marginBottom:6}}>{act.desc}</div>
                              {/* Google Map 連結：只在有值時顯示 */}
                              {act.mapUrl?(
                                <a className="map-btn" href={mapHref(act.mapUrl)} target="_blank" rel="noreferrer"
                                  style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,color:col.hd,border:`1.5px solid ${col.hd}`,padding:"2px 9px",borderRadius:20,textDecoration:"none"}}>
                                  📍 Google Map
                                </a>
                              ):(
                                <span style={{fontSize:11,color:"#CFD8DC",fontStyle:"italic"}}>— 尚未設定地圖連結，點 ✏️ 編輯貼入</span>
                              )}
                            </div>
                            <div className="act-ctrls" style={{display:"flex",gap:4,opacity:0,flexShrink:0}}>
                              <button onClick={()=>openModal(di,ai)}
                                style={{background:"#E3F2FD",border:"none",width:30,height:30,borderRadius:8,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✏️</button>
                              <button onClick={()=>delAct(di,ai)}
                                style={{background:"#FFEBEE",border:"none",width:30,height:30,borderRadius:8,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                            </div>
                          </div>
                        );
                      })}
                      <button className="add-act-btn" onClick={()=>addAct(di)}
                        style={{display:"flex",alignItems:"center",gap:7,width:"100%",padding:"10px 12px",background:"none",border:"2px dashed #FFD600",borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,color:"#FF8F00",marginTop:6}}>
                        ＋ 新增活動
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button className="add-day-btn" onClick={addDay}
            style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"16px",background:"none",border:"2.5px dashed #90CAF9",borderRadius:20,cursor:"pointer",fontFamily:"'Nunito',inherit",fontSize:16,fontWeight:800,color:"#90A4AE",marginTop:12}}>
            ＋ 新增一天
          </button>

          <div style={{display:"flex",gap:10,marginTop:20,flexWrap:"wrap"}}>
            {[["📋 複製行程",copyPlan],["🖨️ 列印",()=>window.print()],["🔄 重新規劃",()=>{setTrip(null);setQuery("");}]].map(([lbl,fn],i)=>(
              <button key={i} className="bar-btn" onClick={fn}
                style={{background:"#fff",color:"#1565C0",border:"2px solid #90CAF9",padding:"10px 20px",borderRadius:14,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700}}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVITY MODAL */}
      {modal&&(
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(21,101,192,.35)",display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div style={{background:"#fff",borderRadius:24,padding:"24px 28px",width:"min(480px,94vw)",maxHeight:"85vh",overflowY:"auto",border:"3px solid #FFD600",boxShadow:"0 12px 40px rgba(21,101,192,.2)",animation:"pop .25s ease"}}>
            <div style={{fontFamily:"'Nunito',sans-serif",fontSize:20,fontWeight:900,color:"#1565C0",marginBottom:18}}>✏️ 編輯活動</div>
            {[["time","⏰ 時間","09:00"],["icon","🎨 Emoji","🍜"],["name","📝 名稱",""],["desc","💬 簡介",""]].map(([k,lbl,ph])=>(
              <div key={k} style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:13,fontWeight:800,color:"#1565C0",marginBottom:5}}>{lbl}</label>
                {k==="desc"
                  ?<textarea style={{width:"100%",border:"2px solid #90CAF9",borderRadius:10,padding:"9px 13px",fontFamily:"inherit",fontSize:15,color:"#1A237E",background:"#F0F7FF",minHeight:64,resize:"vertical"}} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
                  :<input   style={{width:"100%",border:"2px solid #90CAF9",borderRadius:10,padding:"9px 13px",fontFamily:"inherit",fontSize:15,color:"#1A237E",background:"#F0F7FF"}} placeholder={ph} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
                }
              </div>
            ))}
            {/* Google Map URL 欄位，有說明 */}
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:13,fontWeight:800,color:"#1565C0",marginBottom:4}}>📍 Google Maps 網址</label>
              <div style={{fontSize:11,color:"#90A4AE",marginBottom:6}}>
                在 Google Maps 找到地點後，點「分享」→「複製連結」→ 貼入這裡
              </div>
              <input style={{width:"100%",border:"2px solid #90CAF9",borderRadius:10,padding:"9px 13px",fontFamily:"inherit",fontSize:14,color:"#1A237E",background:"#F0F7FF"}}
                placeholder="https://maps.app.goo.gl/..." value={form.mapUrl||""} onChange={e=>setForm(f=>({...f,mapUrl:e.target.value}))} />
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}}>
              <button onClick={()=>setModal(null)} style={{background:"#F0F7FF",border:"2px solid #90CAF9",padding:"10px 20px",borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,color:"#546E7A"}}>取消</button>
              <button onClick={saveModal} style={{background:"linear-gradient(135deg,#1565C0,#0D47A1)",color:"#fff",border:"none",padding:"10px 24px",borderRadius:12,cursor:"pointer",fontFamily:"'Nunito',inherit",fontSize:14,fontWeight:800,boxShadow:"0 4px 12px rgba(21,101,192,.3)"}}>儲存 ✅</button>
            </div>
          </div>
        </div>
      )}

      {/* INFO MODAL */}
      {infoModal&&im&&(
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(21,101,192,.35)",display:"flex",alignItems:"center",justifyContent:"center"}}
          onClick={e=>{if(e.target===e.currentTarget)setInfoModal(null);}}>
          <div style={{background:"#fff",borderRadius:24,padding:"24px 28px",width:"min(480px,94vw)",maxHeight:"85vh",overflowY:"auto",border:`3px solid ${im.color}`,boxShadow:"0 12px 40px rgba(0,0,0,.15)",animation:"pop .25s ease"}}>
            <div style={{fontFamily:"'Nunito',sans-serif",fontSize:20,fontWeight:900,color:im.color,marginBottom:18}}>{im.title}</div>
            {im.fields.map(([k,lbl])=>(
              <div key={k} style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:13,fontWeight:800,color:im.color,marginBottom:5}}>{lbl}</label>
                {k==="mapUrl"?(
                  <>
                    <div style={{fontSize:11,color:"#90A4AE",marginBottom:6}}>在 Google Maps 找到地點後，點「分享」→「複製連結」→ 貼入</div>
                    <input style={{width:"100%",border:`2px solid ${im.color}50`,borderRadius:10,padding:"9px 13px",fontFamily:"inherit",fontSize:14,color:"#1A237E",background:im.bg}}
                      placeholder="https://maps.app.goo.gl/..." value={infoForm[k]||""} onChange={e=>setInfoForm(f=>({...f,[k]:e.target.value}))} />
                  </>
                ):(
                  <input style={{width:"100%",border:`2px solid ${im.color}50`,borderRadius:10,padding:"9px 13px",fontFamily:"inherit",fontSize:15,color:"#1A237E",background:im.bg}}
                    value={infoForm[k]||""} onChange={e=>setInfoForm(f=>({...f,[k]:e.target.value}))} />
                )}
              </div>
            ))}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:18}}>
              <button onClick={()=>setInfoModal(null)} style={{background:"#F0F7FF",border:"2px solid #90CAF9",padding:"10px 20px",borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:14,fontWeight:700,color:"#546E7A"}}>取消</button>
              <button onClick={saveInfoModal} style={{background:`linear-gradient(135deg,${im.color},${im.color}cc)`,color:"#fff",border:"none",padding:"10px 24px",borderRadius:12,cursor:"pointer",fontFamily:"'Nunito',inherit",fontSize:14,fontWeight:800,boxShadow:`0 4px 12px ${im.color}40`}}>儲存 ✅</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast&&(
        <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"#1A237E",color:"#FFD600",padding:"10px 22px",borderRadius:24,fontSize:15,fontWeight:800,zIndex:300,pointerEvents:"none",whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(26,35,126,.35)",animation:"pop .2s ease"}}>
          {toast}
        </div>
      )}
    </div>
  );
}
