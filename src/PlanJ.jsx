import { useState, useRef, useEffect } from "react";

// ── MOCK DATA ────────────────────────────────────────────
const MOCK_TRIP = {
  title:"北海道冬日奢旅 5天4夜",destination:"日本・北海道",
  dates:"12/20 (六) – 12/24 (三)",travelers:"大人 2 名",theme:"賞雪泡湯・美食・慢旅",
  flight:{
    outbound:{ airline:"長榮航空", flightNo:"BR116", date:"12/20", from:"桃園國際機場 TPE", to:"新千歲機場 CTS", departure:"08:30", arrival:"13:00", price:"約 NT$18,000／人" },
    return:  { airline:"長榮航空", flightNo:"BR115", date:"12/24", from:"新千歲機場 CTS", to:"桃園國際機場 TPE", departure:"14:30", arrival:"18:00", price:"約 NT$18,000／人" },
  },
  transfer:{ type:"定額計程車", detail:"新千歲機場至札幌市區，約 60 分鐘", price:"約 ¥11,000／趟" },
  hotel:{ name:"定山渓 鶴雅リゾートスパ 森の謌", location:"定山溪温泉", roomType:"和洋室露天風呂付", nights:4, pricePerNight:"約 NT$12,000", mapUrl:"" },
  days:[
    { day:1, date:"12/20 (六)", title:"抵達札幌・大通公園夜景", activities:[
      { time:"13:30", icon:"✈️", name:"抵達新千歲空港", desc:"入境後搭定額計程車前往札幌市區。", mapUrl:"" },
      { time:"15:30", icon:"🛍️", name:"狸小路商店街", desc:"北海道最長商店街，伴手禮、藥妝一次搞定。", mapUrl:"" },
      { time:"17:30", icon:"🍜", name:"晚餐：札幌拉麵共和國", desc:"坐擁8家名店，濃郁味噌湯頭是北海道代表味。", mapUrl:"" },
      { time:"19:30", icon:"🎡", name:"大通公園白色燈節", desc:"北海道最美冬季燈節，雪地倒影夢幻如畫。", mapUrl:"" },
      { time:"21:00", icon:"🏨", name:"回 定山渓 鶴雅", desc:"返回飯店，入住檜木露天風呂房。", mapUrl:"" },
    ]},
    { day:2, date:"12/21 (日)", title:"小樽運河・雪景慢遊", activities:[
      { time:"09:00", icon:"🚃", name:"搭 JR 前往小樽", desc:"約 40 分鐘，沿途雪景如明信片。", mapUrl:"" },
      { time:"10:00", icon:"🕯️", name:"小樽運河散步", desc:"石造倉庫倒映雪白運河，冬日最美景致。", mapUrl:"" },
      { time:"12:00", icon:"🦀", name:"午餐：海鮮丼 田中鮮魚店", desc:"現撈海膽、鮭魚卵、蟹肉三色丼，鮮甜無比。", mapUrl:"" },
      { time:"14:00", icon:"🍷", name:"北一哨子館咖啡廳", desc:"百年瓦斯燈倉庫改建，手沖咖啡佐雪景。", mapUrl:"" },
      { time:"16:00", icon:"🎿", name:"小樽音樂盒堂", desc:"手工音樂盒天堂，可訂製專屬紀念品。", mapUrl:"" },
      { time:"20:00", icon:"🏨", name:"回 定山渓 鶴雅", desc:"返回飯店，享用懷石料理晚餐。", mapUrl:"" },
    ]},
    { day:3, date:"12/22 (一)", title:"定山溪泡湯・森林雪浴", activities:[
      { time:"07:00", icon:"♨️", name:"晨間露天風呂", desc:"積雪庭園中泡湯，薄霧瀰漫，絕對療癒。", mapUrl:"" },
      { time:"09:00", icon:"🌲", name:"定山溪自然步道", desc:"踩雪健行，針葉林靜謐如畫，約 2 小時。", mapUrl:"" },
      { time:"12:00", icon:"🍱", name:"飯店和食午餐", desc:"使用北海道時令食材的精緻懷石便當。", mapUrl:"" },
      { time:"14:00", icon:"🛁", name:"下午私湯體驗", desc:"包場岩石風呂 60 分鐘，全身放鬆無比。", mapUrl:"" },
      { time:"18:00", icon:"🍶", name:"懷石晚餐", desc:"10 道料理依序上桌，搭配北海道清酒。", mapUrl:"" },
      { time:"21:00", icon:"🏨", name:"回 定山渓 鶴雅", desc:"夜間泡湯後安眠。", mapUrl:"" },
    ]},
    { day:4, date:"12/23 (二)", title:"富良野雪原・星野度假村", activities:[
      { time:"08:30", icon:"🚌", name:"包車前往富良野", desc:"約 2 小時車程，沿途雪原壯闊無邊。", mapUrl:"" },
      { time:"11:00", icon:"⛷️", name:"富良野滑雪場體驗", desc:"北海道粉雪品質頂級，初學者友善課程。", mapUrl:"" },
      { time:"13:00", icon:"🧀", name:"午餐：富良野起司工坊", desc:"現做披薩搭配富良野限定起司，香濃必吃。", mapUrl:"" },
      { time:"15:00", icon:"🌄", name:"四季彩之丘雪景", desc:"丘陵雪地一望無際，是日本最美雪原之一。", mapUrl:"" },
      { time:"19:00", icon:"🍖", name:"晚餐：成吉思汗烤肉", desc:"道地北海道羊肉烤肉，配生啤暖身必點。", mapUrl:"" },
      { time:"21:00", icon:"🏨", name:"回 定山渓 鶴雅", desc:"返回飯店，最後一晚好好泡湯。", mapUrl:"" },
    ]},
    { day:5, date:"12/24 (三)", title:"聖誕節・掃貨返台", activities:[
      { time:"09:00", icon:"🎄", name:"聖誕節早餐", desc:"飯店特製聖誕節早餐 buffet，氣氛絕佳。", mapUrl:"" },
      { time:"10:30", icon:"🛒", name:"札幌 SAPPORO FACTORY 掃貨", desc:"藥妝、白色戀人、六花亭，禮物一次買齊。", mapUrl:"" },
      { time:"12:30", icon:"🍣", name:"午餐：迴轉壽司 根室花まる", desc:"北海道最後一餐，海膽、鮭魚必點道別。", mapUrl:"" },
      { time:"13:30", icon:"🚌", name:"前往新千歲空港", desc:"定額計程車約 60 分，建議提早 2 小時出發。", mapUrl:"" },
      { time:"18:00", icon:"✈️", name:"BR115 返台", desc:"飛回桃園，結束夢幻北海道聖誕旅。", mapUrl:"" },
    ]},
  ],
};

// ── MOODY PALETTE ────────────────────────────────────────
const DAY_MOODS = [
  { hd:"#4A6670", badge:"#C4956A", light:"#EDF2F4" },
  { hd:"#5C6B5E", badge:"#B8977E", light:"#EEF2EE" },
  { hd:"#6B5B6E", badge:"#A8927A", light:"#F2EEF2" },
  { hd:"#6B5848", badge:"#8B9E8B", light:"#F2EDE9" },
  { hd:"#4A5568", badge:"#C49A6C", light:"#EDF0F4" },
];

const INFO_META = {
  outbound:{ title:"編輯去程班機", color:"#4A6670", bg:"#DDE8EC", darkBg:"#1E2E32", icon:"✈️", lbl:"去程班機",
    fields:[["airline","航空公司"],["flightNo","班號"],["date","日期"],["from","出發地"],["to","目的地"],["departure","出發時間"],["arrival","抵達時間"],["price","票價"]] },
  return:  { title:"編輯回程班機", color:"#6B5B6E", bg:"#E8E0EB", darkBg:"#2A2030", icon:"🛬", lbl:"回程班機",
    fields:[["airline","航空公司"],["flightNo","班號"],["date","日期"],["from","出發地"],["to","目的地"],["departure","出發時間"],["arrival","抵達時間"],["price","票價"]] },
  transfer:{ title:"編輯機場接送", color:"#5C6B5E", bg:"#DDE8DE", darkBg:"#1E2C20", icon:"🚌", lbl:"機場接送",
    fields:[["type","交通方式"],["detail","說明"],["price","費用"]] },
  hotel:   { title:"編輯住宿",    color:"#7A6248", bg:"#EDE3D8", darkBg:"#2C2018", icon:"🏨", lbl:"住宿",
    fields:[["name","飯店名稱"],["location","地點"],["roomType","房型"],["nights","晚數"],["pricePerNight","每晚價格"],["mapUrl","Google Maps 網址"]] },
};

const DESTINATIONS = ["日本・東京","日本・大阪","日本・沖繩","日本・北海道","日本・京都","日本・九州","韓國・首爾","泰國・曼谷","泰國・清邁","印尼・峇里島","越南・峴港","台灣環島","其他（自填）"];
const THEMES = ["放鬆度假","美食探索","文化古蹟","購物血拼","戶外冒險","溫泉療癒","親子同遊","蜜月浪漫","自由探索"];
const BUDGETS = ["經濟實惠（NT$15,000以下）","中等預算（NT$15,000–30,000）","舒適享受（NT$30,000–60,000）","奢華無限（NT$60,000以上）"];
const STARS = ["不限","3星以上","4星以上","5星／精品旅館"];


// ── DATE RANGE PICKER ────────────────────────────────────
function DateRangePicker({ departure, returnDate, onChange, dark, accent, border, text, muted, surface, surface2 }) {
  const [open, setOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState(null);
  const [viewYear, setViewYear] = useState(() => {
    const d = departure ? new Date(departure) : new Date();
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = departure ? new Date(departure) : new Date();
    return d.getMonth();
  });
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const MONTHS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const DAYS   = ["日","一","二","三","四","五","六"];

  function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
  function getFirstDay(y, m)    { return new Date(y, m, 1).getDay(); }
  function toISO(y, m, d)       { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
  function parseISO(s)          { return s ? new Date(s+"T00:00:00") : null; }

  const depDate = parseISO(departure);
  const retDate = parseISO(returnDate);

  function handleDayClick(iso) {
    // 如果沒有去程，或者已經選完去回程 → 重新開始選去程
    if (!departure || returnDate) {
      onChange(iso, "");
    } else {
      // 已有去程，選回程
      if (iso > departure) {
        onChange(departure, iso);
        setOpen(false);
      } else if (iso === departure) {
        // 點同一天 → 重選
        onChange(iso, "");
      } else {
        // 點比去程早的日期 → 改成新去程
        onChange(iso, "");
      }
    }
  }

  function inRange(iso) {
    if (!departure || (!returnDate && !hoverDate)) return false;
    const end = returnDate || hoverDate;
    return iso > departure && iso < end;
  }

  function isStart(iso) { return iso === departure; }
  function isEnd(iso)   { return iso === returnDate; }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDay(viewYear, viewMonth);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = new Date().toISOString().slice(0, 10);

  // Display text
  function fmt(iso) {
    if (!iso) return "—";
    const d = parseISO(iso);
    return `${d.getMonth()+1}/${d.getDate()}`;
  }
  const nights = departure && returnDate
    ? Math.round((parseISO(returnDate) - parseISO(departure)) / 86400000)
    : 0;

  return (
    <div ref={ref} style={{ position:"relative" }}>
      {/* Trigger */}
      <div onClick={() => setOpen(o => !o)} style={{ cursor:"pointer", display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:8, padding:"10px 0", borderBottom:`1px solid ${open ? accent : border}`, transition:"border-color .2s" }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:"2px", textTransform:"uppercase", color: departure ? accent : muted, marginBottom:4 }}>去程</div>
          <div style={{ fontSize:16, color: departure ? text : muted }}>{fmt(departure)}</div>
        </div>
        <div style={{ textAlign:"center", color:muted, fontSize:13 }}>
          {nights > 0 ? <span style={{ fontSize:11, color:accent, letterSpacing:"1px" }}>{nights}晚</span> : "→"}
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:11, letterSpacing:"2px", textTransform:"uppercase", color: returnDate ? accent : muted, marginBottom:4 }}>回程</div>
          <div style={{ fontSize:16, color: returnDate ? text : muted }}>{fmt(returnDate)}</div>
        </div>
      </div>

      {/* Calendar dropdown */}
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 8px)", left:0, right:0, zIndex:100, background:surface, border:`1px solid ${border}`, borderRadius:14, padding:"16px", boxShadow:`0 8px 32px rgba(0,0,0,${dark?.4:.15})`, animation:"popIn .18s ease" }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <button onClick={prevMonth} style={{ background:"none", border:"none", color:muted, cursor:"pointer", fontSize:16, padding:"2px 8px" }}>‹</button>
            <span style={{ fontSize:15, color:text, fontFamily:"'Cormorant Garamond',serif", letterSpacing:"1px" }}>{viewYear} 年 {MONTHS[viewMonth]}</span>
            <button onClick={nextMonth} style={{ background:"none", border:"none", color:muted, cursor:"pointer", fontSize:16, padding:"2px 8px" }}>›</button>
          </div>

          {/* Weekday headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:4 }}>
            {DAYS.map(d => <div key={d} style={{ textAlign:"center", fontSize:11, color:muted, letterSpacing:"1px", padding:"4px 0" }}>{d}</div>)}
          </div>

          {/* Days grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2 }}>
            {cells.map((d, i) => {
              if (!d) return <div key={`e${i}`} />;
              const iso = toISO(viewYear, viewMonth, d);
              const start = isStart(iso), end = isEnd(iso), range = inRange(iso);
              const isPast = iso < today;
              const isHoverRange = !returnDate && hoverDate && departure && iso > departure && iso < hoverDate;
              const bg = (start || end) ? accent : (range || isHoverRange) ? `${accent}25` : "transparent";
              const col = (start || end) ? "#fff" : isPast ? (dark ? "#444" : "#ccc") : text;
              return (
                <div key={iso}
                  onClick={() => !isPast && handleDayClick(iso)}
                  onMouseEnter={() => !returnDate && departure && setHoverDate(iso)}
                  onMouseLeave={() => setHoverDate(null)}
                  style={{ textAlign:"center", padding:"7px 2px", borderRadius: start ? "8px 0 0 8px" : end ? "0 8px 8px 0" : 8, background:bg, color:col, fontSize:13, cursor:isPast?"default":"pointer", fontWeight:(start||end)?600:400, transition:"background .1s" }}>
                  {d}
                </div>
              );
            })}
          </div>

          {/* Hint */}
          <div style={{ marginTop:12, fontSize:11, color:muted, textAlign:"center", letterSpacing:"0.5px" }}>
            {!departure ? "請選擇去程日期" : !returnDate ? "請選擇回程日期" : `已選 ${nights} 晚`}
          </div>
        </div>
      )}
    </div>
  );
}

// ── SHARE via URL ────────────────────────────────────────
function encodeTrip(trip) {
  try {
    const json = JSON.stringify(trip);
    // btoa needs latin1, so encode as URI first
    const encoded = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g,
      (_, p1) => String.fromCharCode('0x' + p1)));
    return encoded;
  } catch(e) { return null; }
}
function decodeTrip(str) {
  try {
    const json = decodeURIComponent(Array.from(atob(str),
      c => '%' + c.charCodeAt(0).toString(16).padStart(2,'0')).join(''));
    return JSON.parse(json);
  } catch(e) { return null; }
}

function injectReturnToHotel(trip) {
  const h = trip.hotel;
  const hotelName = h?.name || "飯店";
  const hotelMapUrl = h ? (h.mapUrl && h.mapUrl.startsWith("http") ? h.mapUrl : `https://www.google.com/maps/search/${encodeURIComponent((h.name||"")+" "+(h.location||""))}`) : "";
  return {
    ...trip,
    days: trip.days.map(day => {
      const last = day.activities[day.activities.length - 1];
      if (last?.name?.startsWith("回 ")) return day;
      const [lh,lm] = (last?.time||"20:00").split(":").map(Number);
      const rm = lh*60+(lm||0)+60;
      const rh = Math.floor(rm/60)%24;
      return { ...day, activities: [...day.activities,
        { time:`${String(rh).padStart(2,"0")}:${String(rm%60).padStart(2,"0")}`, icon:"🏨", name:`回 ${hotelName}`, desc:"返回飯店，享受今晚的美好時光。", mapUrl:hotelMapUrl }
      ]};
    }),
  };
}

function reassignTimes(acts, origTimes) { return acts.map((a,i) => ({...a, time: origTimes[i] ?? a.time})); }
function mapHref(v) { if(!v)return null; if(v.startsWith("http"))return v; return `https://www.google.com/maps/search/${encodeURIComponent(v)}`; }
function autoMapUrl(act, hotel) {
  if(act.mapUrl && act.mapUrl.startsWith("http")) return act.mapUrl;
  // Use activity name as search keyword
  const q = act.mapUrl || act.name;
  return `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
}

// ── CSS ──────────────────────────────────────────────────
const makeCSS = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Noto+Sans+TC:wght@300;400;500&family=DM+Serif+Display:ital@1&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fly    { from{transform:translateX(-14px) rotate(-6deg)} to{transform:translateX(14px) rotate(6deg)} }
  @keyframes popIn  { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
  * { box-sizing:border-box; margin:0; padding:0; }
  textarea:focus,input:focus,select:focus { outline:none; }
  input::placeholder,textarea::placeholder { color:${dark?"#555":"#aaa"}; }
  select option { background:${dark?"#1a1a1a":"#fff"}; color:${dark?"#e0d8cf":"#2c2825"}; }

  .form-field:focus-within label { color:${dark?"#C4956A":"#8B6B4A"}; }
  .input-el {
    width:100%; border:none; border-bottom:1px solid ${dark?"#333":"#ddd"};
    background:transparent; padding:8px 0; font-family:inherit;
    font-size:15px; color:${dark?"#e0d8cf":"#2c2825"};
    transition:border-color .2s;
  }
  .input-el:focus { border-bottom-color:${dark?"#C4956A":"#8B6B4A"}; }
  select.input-el { cursor:pointer; appearance:none; -webkit-appearance:none; }

  .act-row:hover { background:${dark?"rgba(255,255,255,.04)":"rgba(0,0,0,.025)"}!important; }
  .act-row:hover .act-ctrls { opacity:1!important; }
  .drag-over { outline:1.5px dashed ${dark?"#C4956A":"#8B6B4A"}!important; }

  .info-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px ${dark?"rgba(0,0,0,.4)":"rgba(0,0,0,.1)"}!important; }
  .info-card:hover .edit-btn { opacity:1!important; }
  .info-card { transition:transform .2s,box-shadow .2s; }

  .day-block { animation: fadeUp .3s ease both; }
  .tog-btn:hover { transform:scale(1.1); }
  .tog-btn { transition:transform .2s,box-shadow .2s; }
  .chip-btn:hover { background:${dark?"#C4956A":"#8B6B4A"}!important; color:#fff!important; }
  .chip-btn { transition:all .15s; }
  .confirm-btn:hover { opacity:.88; }
  .bar-btn:hover { background:${dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.05)"}!important; }
  .add-act-btn:hover { border-color:${dark?"#C4956A":"#8B6B4A"}!important; color:${dark?"#C4956A":"#8B6B4A"}!important; }
  .add-day-btn:hover { border-color:${dark?"#C4956A":"#8B6B4A"}!important; color:${dark?"#C4956A":"#8B6B4A"}!important; }
  .map-lnk:hover { background:${dark?"#C4956A":"#8B6B4A"}!important; color:#fff!important; border-color:transparent!important; }
  .map-lnk { transition:all .15s; }

  @media(max-width:768px){
    .form-preview-wrap { flex-direction:column!important; }
    .preview-panel { display:none!important; }
    .form-panel { width:100%!important; }
    .result-grid { grid-template-columns:1fr 1fr!important; }
    .desktop-days { grid-template-columns:1fr!important; }
    nav { flex-wrap:wrap!important; gap:8px!important; padding:10px 16px!important; height:auto!important; }
    nav > div:last-child { width:100%!important; justify-content:flex-start!important; }
    /* Mobile activity: hide desktop elements */
    .act-mobile .drag-handle-el { display:none!important; }
    .act-mobile .act-desktop-row { display:none!important; }
    .act-mobile .act-mobile-layout { display:block!important; }
    .act-mobile .act-ctrls { opacity:1!important; flex-direction:row!important; }
    .day-actions-desktop { display:none!important; }
  }
  @media(max-width:480px){
    .result-grid { grid-template-columns:1fr!important; }
    nav { padding:10px 12px!important; }
  }
  @media(min-width:769px){
    .day-swipe-actions { display:none!important; }
    .act-mobile-layout { display:none!important; }
    .act-desktop-row { display:flex!important; }
    .day-actions-desktop { display:flex!important; }
  }
`;

export default function PlanJ() {
  const [dark, setDark]           = useState(true);
  const [phase, setPhase]         = useState("form"); // form | loading | result
  const [trip, setTrip]           = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [modal, setModal]         = useState(null);
  const [form, setForm]           = useState({});
  const [infoModal, setInfoModal] = useState(null);
  const [infoForm, setInfoForm]   = useState({});
  const [dragOver, setDragOver]   = useState(null);
  const [swipedDay, setSwipedDay] = useState(null); // which day banner is swiped
  const swipeStart = useRef(null);
  const [toast, setToast]         = useState("");
  const [formData, setFormData]   = useState({
    adults:"2", children:"0", departure:"", returnDate:"", destination:"日本・北海道",
    theme:"溫泉療癒", budget:"舒適享受（NT$30,000–60,000）", car:"不租車", star:"4星以上",
    destCustom:"",
  });

  // ── Load trip on mount: /s/:id short URL, ?trip= param, or sessionStorage
  useEffect(() => {
    async function loadTrip() {
      // 1. Short URL: /s/abc123
      const pathMatch = window.location.pathname.match(/^\/s\/([a-zA-Z0-9]+)$/);
      if (pathMatch) {
        try {
          const res = await fetch(`/api/share/${pathMatch[1]}`);
          const data = await res.json();
          if (data.trip) {
            setTrip(data.trip);
            setCollapsed({});
            setPhase("result");
            sessionStorage.setItem("planj_trip", JSON.stringify(data.trip));
            return;
          }
        } catch(e) {}
      }
      // 2. Legacy ?trip= param
      const params = new URLSearchParams(window.location.search);
      const tripParam = params.get("trip");
      if (tripParam) {
        const decoded = decodeTrip(tripParam);
        if (decoded) {
          setTrip(decoded);
          setCollapsed({});
          setPhase("result");
          sessionStorage.setItem("planj_trip", JSON.stringify(decoded));
          return;
        }
      }
      // 3. sessionStorage (page refresh)
      const saved = sessionStorage.getItem("planj_trip");
      if (saved) {
        try {
          const decoded = JSON.parse(saved);
          setTrip(decoded);
          setCollapsed({});
          setPhase("result");
        } catch(e) {}
      }
    }
    loadTrip();
  }, []);

  // ── Save trip to sessionStorage whenever it changes
  useEffect(() => {
    if (trip) sessionStorage.setItem("planj_trip", JSON.stringify(trip));
    else sessionStorage.removeItem("planj_trip");
  }, [trip]);

  const toastRef  = useRef(null);
  const dragSrc   = useRef(null);
  const resultRef = useRef(null);

  const D = dark;
  const bg     = D ? "#111110" : "#F7F4F0";
  const surface= D ? "#1C1B19" : "#FFFFFF";
  const surface2= D ? "#242320" : "#F0ECE6";
  const border = D ? "#2E2C29" : "#E5E0D8";
  const text    = D ? "#E0D8CF" : "#2C2825";
  const muted   = D ? "#7A7267" : "#9A8F83";
  const accent  = D ? "#C4956A" : "#8B6B4A";
  const accentBg= D ? "rgba(196,149,106,.12)" : "rgba(139,107,74,.08)";

  function showToast(msg) { setToast(msg); clearTimeout(toastRef.current); toastRef.current=setTimeout(()=>setToast(""),2200); }
  function updateTrip(fn) { setTrip(p=>{ const t=JSON.parse(JSON.stringify(p)); fn(t); return t; }); }
  function fd(k,v) { setFormData(p=>({...p,[k]:v})); }

  // ── Generate
  async function generate() {
    setPhase("loading");
    try {
      const dest = formData.destination === "其他（自填）" ? formData.destCustom : formData.destination;
      const query = `大人${formData.adults}名，小孩${formData.children}名。去程${formData.departure}，回程${formData.returnDate}。目的地：${dest}。主題：${formData.theme}。預算：${formData.budget}。${formData.car}。飯店偏好：${formData.star}。${formData.note??""}`;
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) { showToast("規劃失敗：" + data.error); setPhase("form"); return; }
      setTrip(injectReturnToHotel(data.trip));
      setCollapsed({});
      setPhase("result");
    } catch(e) {
      showToast("網路錯誤，請重試");
      setPhase("form");
    }
    setTimeout(()=>resultRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
  }

  // ── Activity modal
  function openModal(di,ai) {
    const a=trip.days[di].activities[ai]||{};
    setForm({time:a.time||"",icon:a.icon||"",name:a.name||"",desc:a.desc||"",mapUrl:a.mapUrl||""});
    setModal({di,ai});
  }
  function saveModal() { updateTrip(t=>Object.assign(t.days[modal.di].activities[modal.ai],form)); setModal(null); showToast("已儲存"); }

  // ── Info modal
  function openInfoModal(key) {
    const src=key==="outbound"?trip.flight?.outbound:key==="return"?trip.flight?.return:key==="transfer"?trip.transfer:trip.hotel;
    setInfoForm({...(src||{})});
    setInfoModal(key);
  }
  function saveInfoModal() {
    updateTrip(t=>{
      if(infoModal==="outbound") Object.assign(t.flight.outbound,infoForm);
      else if(infoModal==="return") Object.assign(t.flight.return,infoForm);
      else if(infoModal==="transfer") Object.assign(t.transfer,infoForm);
      else if(infoModal==="hotel"){Object.assign(t.hotel,infoForm);t.hotel.nights=Number(infoForm.nights)||t.hotel.nights;}
    });
    setInfoModal(null); showToast("已儲存");
  }

  // ── CRUD
  function delAct(di,ai){updateTrip(t=>t.days[di].activities.splice(ai,1));showToast("已刪除");}
  function copyAct(di,ai){updateTrip(t=>t.days[di].activities.splice(ai+1,0,{...t.days[di].activities[ai]}));showToast("已複製");}
  function addAct(di){updateTrip(t=>t.days[di].activities.push({time:"12:00",icon:"📍",name:"新活動",desc:"",mapUrl:""}));setTimeout(()=>openModal(di,trip.days[di].activities.length),30);}
  function delDay(i){if(trip.days.length<=1){showToast("至少保留一天");return;}if(!confirm(`刪除 Day ${trip.days[i].day}？`))return;updateTrip(t=>{t.days.splice(i,1);t.days.forEach((d,j)=>d.day=j+1);});showToast("已刪除");}
  function addDay(){updateTrip(t=>{const l=t.days[t.days.length-1];t.days.push({day:l.day+1,date:"待定",title:"新的一天",activities:[{time:"09:00",icon:"📍",name:"新活動",desc:"",mapUrl:""}]});});showToast("已新增");}
  function editDayTitle(i){const v=prompt("當天主題：",trip.days[i].title);if(v)updateTrip(t=>t.days[i].title=v);}

  // ── Drag
  function onDragStart(e,di,ai){dragSrc.current={di,ai};e.dataTransfer.effectAllowed="move";}
  function onDragOver(e,di,ai){e.preventDefault();setDragOver({di,ai});}
  function onDragLeave(){setDragOver(null);}
  function onDrop(e,di,ai){
    e.preventDefault();setDragOver(null);
    const s=dragSrc.current;if(!s||(s.di===di&&s.ai===ai))return;
    updateTrip(t=>{
      const sT=t.days[s.di].activities.map(a=>a.time);
      const dT=s.di===di?sT:t.days[di].activities.map(a=>a.time);
      const [m]=t.days[s.di].activities.splice(s.ai,1);
      t.days[di].activities.splice(ai,0,m);
      t.days[s.di].activities.forEach((a,i)=>{a.time=sT[i]??a.time;});
      if(s.di!==di)t.days[di].activities.forEach((a,i)=>{a.time=dT[i]??a.time;});
    });
    showToast("順序已更新");
  }

  function copyPlan(){
    if(!trip)return;
    let txt=`${trip.title}\n${trip.dates} · ${trip.travelers}\n\n`;
    trip.days.forEach(d=>{txt+=`【Day ${d.day}】${d.title} (${d.date})\n`;d.activities.forEach(a=>txt+=`  ${a.time} ${a.icon} ${a.name}\n`);txt+="\n";});
    navigator.clipboard.writeText(txt).then(()=>showToast("已複製行程"));
  }

  async function shareTrip(){
    if(!trip)return;
    showToast("產生分享連結中…");
    try {
      const res = await fetch("/api/share", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ trip }),
      });
      const data = await res.json();
      if(data.error || !data.id){ throw new Error(data.error||"no id"); }
      const url = `${window.location.origin}/s/${data.id}`;
      // Use clipboard API with fallback
      if(navigator.clipboard && navigator.clipboard.writeText){
        await navigator.clipboard.writeText(url);
        showToast("分享連結已複製！傳給朋友吧 ✈️");
      } else {
        // Fallback: prompt user to copy manually
        window.prompt("複製這個分享連結：", url);
      }
    } catch(e){
      // Fallback: use encoded URL directly
      try {
        const encoded = encodeTrip(trip);
        if(encoded){
          const url = `${window.location.origin}${window.location.pathname}?trip=${encoded}`;
          if(navigator.clipboard && navigator.clipboard.writeText){
            await navigator.clipboard.writeText(url);
            showToast("分享連結已複製（長連結）✈️");
          } else {
            window.prompt("複製這個分享連結：", url);
          }
        }
      } catch(e2){ showToast("分享失敗，請重試"); }
    }
  }

  function getInfoCards() {
    if(!trip)return[];
    const f=trip.flight,tr=trip.transfer,h=trip.hotel;
    const hMap=(h?.mapUrl&&h.mapUrl.startsWith("http"))?h.mapUrl:h?`https://www.google.com/maps/search/${encodeURIComponent((h.name||"")+" "+(h.location||""))}`:"";
    return [
      f?.outbound&&{key:"outbound",...INFO_META.outbound,title:`${f.outbound.airline} ${f.outbound.flightNo}`,lines:[f.outbound.date&&`📅 ${f.outbound.date}`,`${f.outbound.from} → ${f.outbound.to}`,`⏰ ${f.outbound.departure} → ${f.outbound.arrival}`,`💰 ${f.outbound.price}`].filter(Boolean),note:"班機資訊為 AI 建議，請至航空公司確認"},
      f?.return&&  {key:"return",...INFO_META.return,  title:`${f.return.airline} ${f.return.flightNo}`,  lines:[f.return.date&&`📅 ${f.return.date}`,`${f.return.from} → ${f.return.to}`,`⏰ ${f.return.departure} → ${f.return.arrival}`,`💰 ${f.return.price}`].filter(Boolean),note:"班機資訊為 AI 建議，請至航空公司確認"},
      tr&&         {key:"transfer",...INFO_META.transfer,title:tr.type,lines:[tr.detail,tr.price]},
      h&&          {key:"hotel",...INFO_META.hotel,title:h.name,lines:[h.location,h.roomType,`${h.nights}晚 · ${h.pricePerNight}／晚`],mapUrl:hMap},
    ].filter(Boolean);
  }

  const infoCards=getInfoCards();
  const im=infoModal?INFO_META[infoModal]:null;
  const destDisplay=formData.destination==="其他（自填）"?formData.destCustom||"—":formData.destination;
  const nights=formData.departure&&formData.returnDate?Math.max(0,Math.round((new Date(formData.returnDate)-new Date(formData.departure))/(86400000))):"—";

  // ── SHARED STYLES
  const inputStyle={width:"100%",border:"none",borderBottom:`1px solid ${border}`,background:"transparent",padding:"8px 0",fontFamily:"inherit",fontSize:15,color:text,transition:"border-color .2s"};
  const labelStyle={display:"block",fontSize:12,letterSpacing:"2px",textTransform:"uppercase",color:muted,marginBottom:6};
  const selectStyle={...inputStyle,cursor:"pointer",appearance:"none",WebkitAppearance:"none"};
  const sectionLabel={fontSize:12,letterSpacing:"3px",textTransform:"uppercase",color:accent,marginBottom:14,fontFamily:"'Noto Sans TC',sans-serif"};
  const cardStyle={background:surface,border:`1px solid ${border}`,borderRadius:16,padding:"20px 22px"};

  return (
    <div style={{fontFamily:"'Noto Sans TC',sans-serif",background:bg,minHeight:"100vh",color:text,transition:"background .3s,color .3s"}}>
      <style>{makeCSS(D)}</style>

      {/* ── NAV */}
      <nav style={{background:surface,borderBottom:`1px solid ${border}`,padding:"0 32px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:40,backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:10}}>
          <span style={{fontFamily:"'DM Serif Display',serif",fontStyle:"italic",fontSize:24,color:text,letterSpacing:"-0.5px"}}>PlanJ</span>
          <span style={{fontSize:13,color:muted,letterSpacing:"1px"}}>一起 J</span>
        </div>
        {phase==="result"&&trip&&(
          <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
            <button className="bar-btn" onClick={copyPlan} style={{background:"none",border:`1px solid ${border}`,color:muted,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12,whiteSpace:"nowrap"}}>複製行程</button>
            <button className="bar-btn" onClick={shareTrip} style={{background:accentBg,border:`1px solid ${accent}50`,color:accent,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:500,whiteSpace:"nowrap"}}>🔗 分享</button>
            <button className="bar-btn" onClick={()=>{setPhase("form");setTrip(null);sessionStorage.removeItem("planj_trip");window.history.replaceState({},"",window.location.pathname);}} style={{background:"none",border:`1px solid ${border}`,color:muted,padding:"6px 12px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",fontSize:12,whiteSpace:"nowrap"}}>重新規劃</button>
          </div>
        )}
      </nav>

      {/* ── FORM PHASE */}
      {phase==="form"&&(
        <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 24px 80px"}}>
          <div style={{marginBottom:40}}>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:400,color:text,lineHeight:1.2,marginBottom:8}}>
              規劃你的下一段旅程
            </h1>
            <p style={{color:muted,fontSize:14,letterSpacing:"0.5px"}}>填寫旅遊需求，AI 為你量身打造完整行程</p>
          </div>

          {/* Form + Preview side by side */}
          <div className="form-preview-wrap" style={{display:"flex",gap:28,alignItems:"flex-start"}}>

            {/* LEFT: Form */}
            <div className="form-panel" style={{flex:"1 1 0",minWidth:0}}>
              <div style={{display:"flex",flexDirection:"column",gap:28}}>

                {/* 人數 */}
                <div style={cardStyle}>
                  <div style={sectionLabel}>👥 旅客人數</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                    <div className="form-field">
                      <label style={labelStyle}>大人</label>
                      <select className="input-el" style={selectStyle} value={formData.adults} onChange={e=>fd("adults",e.target.value)}>
                        {[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="form-field">
                      <label style={labelStyle}>小孩</label>
                      <select className="input-el" style={selectStyle} value={formData.children} onChange={e=>fd("children",e.target.value)}>
                        {[0,1,2,3,4,5,6].map(n=><option key={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 日期 range picker */}
                <div style={cardStyle}>
                  <div style={sectionLabel}>📅 旅遊日期</div>
                  <DateRangePicker
                    departure={formData.departure} returnDate={formData.returnDate}
                    onChange={(dep,ret)=>{ fd("departure",dep); fd("returnDate",ret); }}
                    dark={D} accent={accent} border={border} text={text} muted={muted} surface={surface} surface2={surface2}
                  />
                </div>

                {/* 目的地 */}
                <div style={cardStyle}>
                  <div style={sectionLabel}>📍 目的地</div>
                  <div className="form-field">
                    <label style={labelStyle}>選擇地點</label>
                    <select className="input-el" style={selectStyle} value={formData.destination} onChange={e=>fd("destination",e.target.value)}>
                      {DESTINATIONS.map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  {formData.destination==="其他（自填）"&&(
                    <div className="form-field" style={{marginTop:16}}>
                      <label style={labelStyle}>自填目的地</label>
                      <input className="input-el" style={inputStyle} placeholder="例：法國・巴黎" value={formData.destCustom} onChange={e=>fd("destCustom",e.target.value)} />
                    </div>
                  )}
                </div>

                {/* 主題 */}
                <div style={cardStyle}>
                  <div style={sectionLabel}>✨ 旅遊主題</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                    {THEMES.map(t=>(
                      <button key={t} className="chip-btn" onClick={()=>fd("theme",t)}
                        style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${formData.theme===t?accent:border}`,background:formData.theme===t?accentBg:"transparent",color:formData.theme===t?accent:muted,fontSize:14,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="form-field">
                    <label style={labelStyle}>補充說明（選填）</label>
                    <input className="input-el" style={inputStyle} placeholder="例：想要安靜、不喜歡人多的地方..." value={formData.note||""} onChange={e=>fd("note",e.target.value)} />
                  </div>
                </div>

                {/* 預算 / 租車 / 星級 */}
                <div style={cardStyle}>
                  <div style={sectionLabel}>⚙️ 其他偏好</div>
                  <div style={{display:"flex",flexDirection:"column",gap:20}}>
                    <div className="form-field">
                      <label style={labelStyle}>預算範圍（每人）</label>
                      <select className="input-el" style={selectStyle} value={formData.budget} onChange={e=>fd("budget",e.target.value)}>
                        {BUDGETS.map(b=><option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                      <div className="form-field">
                        <label style={labelStyle}>租車</label>
                        <select className="input-el" style={selectStyle} value={formData.car} onChange={e=>fd("car",e.target.value)}>
                          <option>不租車</option><option>租車</option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label style={labelStyle}>飯店偏好</label>
                        <select className="input-el" style={selectStyle} value={formData.star} onChange={e=>fd("star",e.target.value)}>
                          {STARS.map(s=><option key={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button className="confirm-btn" onClick={generate}
                  style={{width:"100%",padding:"18px",background:accent,color:"#fff",border:"none",borderRadius:14,fontSize:17,fontWeight:500,cursor:"pointer",fontFamily:"'Noto Sans TC',sans-serif",letterSpacing:"2px",transition:"opacity .15s"}}>
                  確認需求，開始規劃 →
                </button>
              </div>
            </div>

            {/* RIGHT: Live Preview */}
            <div className="preview-panel" style={{width:300,flexShrink:0,position:"sticky",top:80}}>
              <div style={{...cardStyle,border:`1px solid ${accent}30`}}>
                <div style={{...sectionLabel,marginBottom:20}}>行程摘要預覽</div>
                {[
                  ["目的地", destDisplay||"—"],
                  ["旅客", `大人 ${formData.adults} 名${Number(formData.children)>0?" · 小孩 "+formData.children+" 名":""}`],
                  ["去程", formData.departure||"—"],
                  ["回程", formData.returnDate||"—"],
                  ["天數", nights!=="—"?`${nights}晚 ${Number(nights)+1}天`:"—"],
                  ["主題", formData.theme||"—"],
                  ["預算", formData.budget.split("（")[0]||"—"],
                  ["租車", formData.car],
                  ["飯店", formData.star],
                ].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"10px 0",borderBottom:`1px solid ${border}`}}>
                    <span style={{fontSize:13,color:muted,letterSpacing:"1px"}}>{k}</span>
                    <span style={{fontSize:14,color:text,fontWeight:500,textAlign:"right",maxWidth:160}}>{v}</span>
                  </div>
                ))}
                {formData.note&&(
                  <div style={{marginTop:14,padding:"10px 12px",background:accentBg,borderRadius:8,fontSize:12,color:muted,lineHeight:1.6}}>
                    「{formData.note}」
                  </div>
                )}
                <button className="confirm-btn" onClick={generate}
                  style={{width:"100%",marginTop:20,padding:"13px",background:accent,color:"#fff",border:"none",borderRadius:10,fontSize:14,cursor:"pointer",fontFamily:"inherit",letterSpacing:"1.5px",transition:"opacity .15s"}}>
                  開始規劃 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LOADING */}
      {phase==="loading"&&(
        <div style={{textAlign:"center",padding:"100px 20px"}}>
          <div style={{fontSize:36,animation:"fly 1.3s ease-in-out infinite alternate",display:"inline-block",marginBottom:20}}>✈️</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,color:text,marginBottom:10}}>正在規劃你的旅程</div>
          <div style={{fontSize:13,color:muted,letterSpacing:"2px"}}>搜尋班機 · 確認住宿 · 安排景點</div>
        </div>
      )}

      {/* ── RESULT */}
      {phase==="result"&&trip&&(
        <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 24px 100px"}} ref={resultRef}>

          {/* Trip header */}
          <div style={{marginBottom:32,animation:"fadeUp .4s ease"}}>
            <p style={{fontSize:11,letterSpacing:"4px",textTransform:"uppercase",color:accent,marginBottom:8}}>Your Itinerary</p>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,3.5vw,2.8rem)",fontWeight:400,color:text,lineHeight:1.2,marginBottom:12}}>{trip.title}</h2>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {[trip.destination,trip.dates,trip.travelers,trip.theme].map((v,i)=>(
                <span key={i} style={{fontSize:12,color:muted,border:`1px solid ${border}`,padding:"4px 12px",borderRadius:20,letterSpacing:"0.5px"}}>{v}</span>
              ))}
            </div>
          </div>

          {/* Info cards 2x2 */}
          <div style={{marginBottom:16,...sectionLabel}}>交通 & 住宿</div>
          <div className="result-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:36}}>
            {infoCards.map((c,i)=>(
              <div key={i} className="info-card" style={{background:D?c.darkBg:c.bg,border:`1px solid ${D?c.color+"40":c.color+"30"}`,borderRadius:14,padding:"18px 20px",position:"relative",animation:"none"}}>
                <button onClick={()=>openInfoModal(c.key)}
                  style={{position:"absolute",top:12,right:12,background:`${c.color}18`,border:`1px solid ${c.color}50`,color:c.color,borderRadius:6,padding:"4px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit",letterSpacing:"1px"}}>
                  ✏️ 編輯
                </button>
                <div style={{fontSize:12,letterSpacing:"2px",textTransform:"uppercase",color:c.color,marginBottom:6,opacity:.9}}>{c.lbl}</div>
                <div style={{fontSize:18,fontFamily:"'Cormorant Garamond',serif",color:text,marginBottom:6,paddingRight:60,lineHeight:1.3}}>{c.title}</div>
                <div style={{fontSize:13,color:muted,lineHeight:1.8}}>{c.lines.map((l,j)=><div key={j}>{l}</div>)}</div>
                {c.note&&<div style={{fontSize:10,color:c.color,marginTop:8,letterSpacing:"0.5px",opacity:.75}}>{c.note}</div>}
                {c.mapUrl&&<a className="map-lnk" href={mapHref(c.mapUrl)} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,marginTop:10,fontSize:11,color:c.color,border:`1px solid ${c.color}40`,padding:"3px 10px",borderRadius:20,textDecoration:"none",letterSpacing:"0.5px"}}>📍 Google Map</a>}
              </div>
            ))}
          </div>

          {/* Days */}
          <div style={{marginBottom:16,...sectionLabel}}>每日行程</div>
          <div className="desktop-days" style={{display:"grid",gridTemplateColumns:"1fr",gap:12}}>
            {trip.days.map((day,di)=>{
              const m=DAY_MOODS[di%DAY_MOODS.length];
              return(
                <div key={di} className="day-block" style={{background:surface,border:`1px solid ${border}`,borderRadius:16,overflow:"hidden"}}>
                  {/* Day header wrapper with swipe support */}
                  <div style={{position:"relative",overflow:"hidden"}}>
                    {/* Swipe-reveal action buttons (mobile only) */}
                    <div className="day-swipe-actions" style={{position:"absolute",right:0,top:0,bottom:0,display:"flex",alignItems:"center",gap:0,zIndex:1}}>
                      <button onClick={e=>{e.stopPropagation();editDayTitle(di);setSwipedDay(null);}}
                        style={{background:"#4A8A6E",border:"none",height:"100%",padding:"0 18px",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>✏️</button>
                      <button onClick={e=>{e.stopPropagation();delDay(di);setSwipedDay(null);}}
                        style={{background:"#C0504D",border:"none",height:"100%",padding:"0 18px",color:"#fff",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>🗑️</button>
                    </div>
                    {/* Banner */}
                    <div
                      style={{background:m.hd,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",
                        position:"relative",zIndex:2,
                        transform:swipedDay===di?"translateX(-96px)":"translateX(0)",
                        transition:"transform .25s ease"}}
                      onClick={()=>{ if(swipedDay===di){setSwipedDay(null);} else {setCollapsed(c=>({...c,[di]:!c[di]}));} }}
                      onTouchStart={e=>{ swipeStart.current={x:e.touches[0].clientX,day:di}; }}
                      onTouchEnd={e=>{
                        if(!swipeStart.current||swipeStart.current.day!==di)return;
                        const dx=e.changedTouches[0].clientX - swipeStart.current.x;
                        if(dx < -50) setSwipedDay(di);
                        else if(dx > 30) setSwipedDay(null);
                        swipeStart.current=null;
                      }}>
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <span style={{background:m.badge,color:"#fff",fontSize:10,fontWeight:600,letterSpacing:"2px",padding:"3px 10px",borderRadius:20,textTransform:"uppercase"}}>Day {day.day}</span>
                        <div>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,color:"#fff",letterSpacing:"0.3px"}}>{day.title}</div>
                          <div style={{fontSize:12,color:"rgba(255,255,255,.55)",marginTop:1,letterSpacing:"0.5px"}}>{day.date}</div>
                        </div>
                      </div>
                      <div className="day-actions-desktop" style={{display:"flex",gap:6,alignItems:"center"}} onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>editDayTitle(di)} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:6,padding:"3px 8px",fontSize:12,color:"rgba(255,255,255,.7)",cursor:"pointer",fontFamily:"inherit"}}>✏️</button>
                        <button onClick={()=>delDay(di)} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:6,padding:"3px 8px",fontSize:12,color:"rgba(255,255,255,.7)",cursor:"pointer",fontFamily:"inherit"}}>🗑️</button>
                        <span style={{color:"rgba(255,255,255,.5)",fontSize:12,marginLeft:4,display:"inline-block",transition:"transform .25s",transform:collapsed[di]?"rotate(-90deg)":"rotate(0)"}}>▾</span>
                      </div>
                    </div>
                  </div>

                  {!collapsed[di]&&(
                    <div style={{padding:"12px 20px"}}>
                      {day.activities.map((act,ai)=>{
                        const isOver=dragOver?.di===di&&dragOver?.ai===ai;
                        return(
                          <div key={ai} className={`act-row${isOver?" drag-over":""}`}
                            draggable onDragStart={e=>onDragStart(e,di,ai)} onDragOver={e=>onDragOver(e,di,ai)} onDragLeave={onDragLeave} onDrop={e=>onDrop(e,di,ai)}
                            style={{display:"flex",alignItems:"flex-start",gap:8,padding:"11px 8px",borderRadius:10,cursor:"grab",border:"1px solid transparent",marginBottom:1}}>
                            {/* Drag handle - hidden on mobile via CSS */}
                            <span className="drag-handle-el" style={{color:border,fontSize:14,cursor:"grab",flexShrink:0,marginTop:14}}>⠿</span>
                            {/* Content */}
                            <div style={{flex:1,minWidth:0}}>
                              {/* Time + icon + name in one line */}
                              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"nowrap"}}>
                                <span style={{fontSize:12,color:accent,fontWeight:600,whiteSpace:"nowrap",letterSpacing:"0.5px",flexShrink:0}}>{act.time}</span>
                                <span style={{fontSize:16,flexShrink:0}}>{act.icon||"📍"}</span>
                                <span style={{fontSize:15,color:text,fontWeight:500,lineHeight:1.3}}>{act.name}</span>
                              </div>
                              {/* Desc below */}
                              <div style={{fontSize:13,color:muted,lineHeight:1.55,marginBottom:6,paddingLeft:2}}>{act.desc}</div>
                              <a className="map-lnk" href={autoMapUrl(act)} target="_blank" rel="noreferrer"
                                style={{display:"inline-flex",alignItems:"center",gap:3,fontSize:11,color:muted,border:`1px solid ${border}`,padding:"2px 8px",borderRadius:20,textDecoration:"none"}}>
                                📍 Google Map
                              </a>
                            </div>
                            {/* Action buttons - vertical, appear on hover (desktop) / always show (mobile) */}
                            <div className="act-ctrls" style={{display:"flex",flexDirection:"column",gap:2,opacity:0,flexShrink:0}}>
                              <button title="複製" onClick={()=>copyAct(di,ai)} style={{background:accentBg,border:"none",width:24,height:24,borderRadius:6,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>📋</button>
                              <button title="編輯" onClick={()=>openModal(di,ai)} style={{background:D?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)",border:"none",width:24,height:24,borderRadius:6,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✏️</button>
                              <button title="刪除" onClick={()=>delAct(di,ai)} style={{background:D?"rgba(255,60,60,.1)":"rgba(200,0,0,.05)",border:"none",width:24,height:24,borderRadius:6,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                            </div>
                          </div>
                        );
                      })}
                      <button className="add-act-btn" onClick={()=>addAct(di)} style={{display:"flex",alignItems:"center",gap:6,width:"100%",padding:"8px 8px",background:"none",border:`1px dashed ${border}`,borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:12,color:muted,marginTop:6,transition:"all .15s",letterSpacing:"0.5px"}}>
                        ＋ 新增活動
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button className="add-day-btn" onClick={addDay} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"14px",background:"none",border:`1px dashed ${border}`,borderRadius:16,cursor:"pointer",fontFamily:"inherit",fontSize:13,color:muted,marginTop:10,letterSpacing:"1px",transition:"all .15s"}}>
            ＋ 新增一天
          </button>
        </div>
      )}

      {/* ── DARK / LIGHT TOGGLE */}
      <button className="tog-btn" onClick={()=>setDark(d=>!d)}
        style={{position:"fixed",bottom:28,right:28,width:48,height:48,borderRadius:"50%",background:surface,border:`1px solid ${border}`,color:text,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px rgba(0,0,0,${D?.4:.15})`,zIndex:50}}>
        {D?"☀️":"🌙"}
      </button>

      {/* ── ACTIVITY MODAL */}
      {modal&&(
        <div style={{position:"fixed",inset:0,zIndex:200,background:D?"rgba(0,0,0,.7)":"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}} onClick={e=>{if(e.target===e.currentTarget)setModal(null);}}>
          <div style={{background:surface,borderRadius:20,padding:"28px 32px",width:"min(480px,94vw)",maxHeight:"85vh",overflowY:"auto",border:`1px solid ${border}`,animation:"popIn .2s ease"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:text,marginBottom:24}}>編輯活動</div>
            {[["time","時間","09:00"],["icon","Emoji","🍜"],["name","名稱",""],["desc","簡介",""]].map(([k,lbl,ph])=>(
              <div key={k} className="form-field" style={{marginBottom:18}}>
                <label style={labelStyle}>{lbl}</label>
                {k==="desc"
                  ?<textarea style={{...inputStyle,minHeight:60,resize:"vertical",display:"block"}} value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
                  :<input style={inputStyle} placeholder={ph} value={form[k]||""} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
                }
              </div>
            ))}
            <div className="form-field" style={{marginBottom:18}}>
              <label style={labelStyle}>Google Maps 網址</label>
              <div style={{fontSize:10,color:muted,marginBottom:6,letterSpacing:"0.5px"}}>在 Google Maps 找到地點 → 分享 → 複製連結 → 貼入</div>
              <input style={inputStyle} placeholder="https://maps.app.goo.gl/..." value={form.mapUrl||""} onChange={e=>setForm(f=>({...f,mapUrl:e.target.value}))} />
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:24}}>
              <button onClick={()=>setModal(null)} style={{background:"none",border:`1px solid ${border}`,padding:"9px 20px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:13,color:muted}}>取消</button>
              <button onClick={saveModal} style={{background:accent,color:"#fff",border:"none",padding:"9px 24px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:13,letterSpacing:"1px"}}>儲存</button>
            </div>
          </div>
        </div>
      )}

      {/* ── INFO MODAL */}
      {infoModal&&im&&(
        <div style={{position:"fixed",inset:0,zIndex:200,background:D?"rgba(0,0,0,.7)":"rgba(0,0,0,.4)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}} onClick={e=>{if(e.target===e.currentTarget)setInfoModal(null);}}>
          <div style={{background:surface,borderRadius:20,padding:"28px 32px",width:"min(480px,94vw)",maxHeight:"85vh",overflowY:"auto",border:`1px solid ${border}`,animation:"popIn .2s ease"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:text,marginBottom:24}}>{im.title}</div>
            {im.fields.map(([k,lbl])=>(
              <div key={k} className="form-field" style={{marginBottom:18}}>
                <label style={labelStyle}>{lbl}</label>
                {k==="mapUrl"&&<div style={{fontSize:10,color:muted,marginBottom:6,letterSpacing:"0.5px"}}>在 Google Maps → 分享 → 複製連結 → 貼入</div>}
                <input style={inputStyle} value={infoForm[k]||""} onChange={e=>setInfoForm(f=>({...f,[k]:e.target.value}))} placeholder={k==="mapUrl"?"https://maps.app.goo.gl/...":""} />
              </div>
            ))}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:24}}>
              <button onClick={()=>setInfoModal(null)} style={{background:"none",border:`1px solid ${border}`,padding:"9px 20px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:13,color:muted}}>取消</button>
              <button onClick={saveInfoModal} style={{background:accent,color:"#fff",border:"none",padding:"9px 24px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",fontSize:13,letterSpacing:"1px"}}>儲存</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST */}
      {toast&&(
        <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",background:surface,color:text,border:`1px solid ${border}`,padding:"10px 20px",borderRadius:20,fontSize:12,zIndex:300,pointerEvents:"none",letterSpacing:"0.5px",boxShadow:`0 4px 16px rgba(0,0,0,${D?.4:.15})`,animation:"popIn .2s ease"}}>
          {toast}
        </div>
      )}
    </div>
  );
}
