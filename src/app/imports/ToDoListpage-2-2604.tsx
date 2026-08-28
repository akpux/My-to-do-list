import svgPaths from "./svg-wizf7kbxcj";

function MobileSignal() {
  return (
    <div className="absolute h-[9.23px] right-[72.39px] translate-y-[-50%] w-[16.615px]" data-name="Mobile Signal" style={{ top: "calc(50% + 3.231px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 10">
        <g id="Mobile Signal">
          <path d={svgPaths.p35a4b800} fill="var(--fill-0, #090A0A)" id="Mobile Signal_2" />
        </g>
      </svg>
    </div>
  );
}

function Wifi() {
  return (
    <div className="absolute h-[10.122px] right-[53.67px] translate-y-[-50%] w-[14.098px]" data-name="Wifi" style={{ top: "calc(50% + 2.292px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
        <g id="Wifi">
          <path d={svgPaths.p1850c780} fill="var(--fill-0, #090A0A)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Battery() {
  return (
    <div className="absolute contents right-[23.48px] translate-y-[-50%]" data-name="Battery" style={{ top: "calc(50% + 2.309px)" }}>
      <div className="absolute h-3 right-[25.31px] translate-y-[-50%] w-[23.077px]" data-name="Rectangle" style={{ top: "calc(50% + 2.308px)" }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 12">
          <path d={svgPaths.p2736f680} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, #090A0A)" strokeWidth="0.923077" />
        </svg>
      </div>
      <div className="absolute h-[3.692px] right-[23.48px] translate-y-[-50%] w-[1.226px]" data-name="Combined Shape" style={{ top: "calc(50% + 2.769px)" }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
          <path d={svgPaths.peff8440} fill="var(--fill-0, #090A0A)" id="Combined Shape" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute h-[7.689px] right-[27.61px] translate-y-[-50%] w-[18.646px]" data-name="Rectangle" style={{ top: "calc(50% + 2.306px)" }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 8">
          <path d={svgPaths.p29b7e780} fill="var(--fill-0, #090A0A)" id="Rectangle" />
        </svg>
      </div>
    </div>
  );
}

function Battery1() {
  return (
    <div className="absolute contents right-[23.48px] translate-y-[-50%]" data-name="Battery" style={{ top: "calc(50% + 2.308px)" }}>
      <Battery />
    </div>
  );
}

function NativeStatusBar() {
  return (
    <div className="h-10 relative shrink-0 w-full" data-name="Native / Status Bar">
      <div className="absolute flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] left-[27.69px] not-italic text-[#090a0a] text-[14.769px] text-nowrap translate-y-[-50%]" style={{ top: "calc(50% + 1.962px)" }}>
        <p className="leading-[14.769px] whitespace-pre">9:41</p>
      </div>
      <MobileSignal />
      <Wifi />
      <Battery1 />
    </div>
  );
}

function Frame645() {
  return (
    <div className="content-stretch flex gap-2 items-center justify-start relative shrink-0">
      <div className="flex flex-col font-['Nunito:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[20px] text-black text-nowrap">
        <p className="leading-[1.2] whitespace-pre">To-do list</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[274px] items-center justify-start relative shrink-0">
      <Frame645 />
    </div>
  );
}

function Frame1984077210() {
  return (
    <div className="content-stretch flex gap-[52px] items-center justify-start relative shrink-0">
      <Frame3 />
    </div>
  );
}

function FunnelSimple() {
  return (
    <div className="relative shrink-0 size-5" data-name="FunnelSimple">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="FunnelSimple">
          <path d={svgPaths.p340bcf80} fill="var(--fill-0, #8E96A0)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Depth3Frame0() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-8" data-name="Depth 3, Frame 0">
      <FunnelSimple />
    </div>
  );
}

function Frame1984077221() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-between pl-4 pr-5 py-2 relative w-full">
          <Frame1984077210 />
          <Depth3Frame0 />
        </div>
      </div>
    </div>
  );
}

function Frame1984077255() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full">
      <NativeStatusBar />
      <Frame1984077221 />
    </div>
  );
}

function Frame553() {
  return (
    <div className="content-stretch flex gap-4 items-start justify-start max-h-10 relative shrink-0 w-full">
      <div className="-webkit-box basis-0 css-1pl2q8 flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-neutral-950">
        <p className="leading-[1.4]">Sanitise your hands when you come home from outside</p>
      </div>
    </div>
  );
}

function Frame1984077262() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-start min-h-px min-w-px relative shrink-0">
      <Frame553 />
    </div>
  );
}

function StateLayer() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="relative rounded-[2px] shrink-0 size-4" data-name="container">
        <div aria-hidden="true" className="absolute border border-[#929292] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
    </div>
  );
}

function Checkboxes() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-6" data-name="Checkboxes">
      <StateLayer />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="content-stretch flex gap-2 items-center justify-start relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="checkbox">
      <Checkboxes />
    </div>
  );
}

function Frame1984077263() {
  return (
    <div className="content-stretch flex gap-0.5 items-start justify-start relative shrink-0 w-full">
      <Frame1984077262 />
      <Checkbox />
    </div>
  );
}

function Alarm() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="Alarm">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Alarm">
          <path d={svgPaths.p36d95180} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077205() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">12 Aug, Mon, 10:30 PM</p>
      </div>
    </div>
  );
}

function Frame622() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <Alarm />
      <Frame1984077205 />
    </div>
  );
}

function ListCheck() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="list-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="list-check">
          <path d={svgPaths.pdde6800} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077206() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Work</p>
      </div>
    </div>
  );
}

function Frame623() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <ListCheck />
      <Frame1984077206 />
    </div>
  );
}

function PriceTagLine() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="price-tag-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="price-tag-line">
          <path d={svgPaths.p1e646b80} fill="var(--fill-0, #E27100)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077207() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#e27100] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">High</p>
      </div>
    </div>
  );
}

function Frame626() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <PriceTagLine />
      <Frame1984077207 />
    </div>
  );
}

function Frame621() {
  return (
    <div className="content-stretch flex gap-[9px] items-center justify-start relative shrink-0">
      <Frame622 />
      <Frame623 />
      <Frame626 />
    </div>
  );
}

function Frame614() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-bl-[8px] rounded-tl-[8px] shrink-0">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-[12px] relative w-full">
          <Frame1984077263 />
          <Frame621 />
        </div>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="bg-[#fcfcfc] content-stretch flex items-start justify-start relative rounded-[8px] shrink-0 w-full" data-name="list item">
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame614 />
    </div>
  );
}

function Frame554() {
  return (
    <div className="content-stretch flex gap-4 items-start justify-start max-h-10 relative shrink-0 w-full">
      <div className="-webkit-box basis-0 css-1pl2q8 flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-neutral-950">
        <p className="leading-[1.4]">Wash daily Clothes</p>
      </div>
    </div>
  );
}

function Frame1984077264() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-start min-h-px min-w-px relative shrink-0">
      <Frame554 />
    </div>
  );
}

function StateLayer1() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="relative rounded-[2px] shrink-0 size-4" data-name="container">
        <div aria-hidden="true" className="absolute border border-[#929292] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
    </div>
  );
}

function Checkboxes1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-6" data-name="Checkboxes">
      <StateLayer1 />
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="content-stretch flex gap-2 items-center justify-start relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="checkbox">
      <Checkboxes1 />
    </div>
  );
}

function Frame1984077266() {
  return (
    <div className="content-stretch flex gap-0.5 items-start justify-start relative shrink-0 w-full">
      <Frame1984077264 />
      <Checkbox1 />
    </div>
  );
}

function Alarm1() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="Alarm">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Alarm">
          <path d={svgPaths.p36d95180} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077209() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">12 Aug, Mon, 10:30 PM</p>
      </div>
    </div>
  );
}

function Frame630() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <Alarm1 />
      <Frame1984077209 />
    </div>
  );
}

function ListCheck1() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="list-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="list-check">
          <path d={svgPaths.pdde6800} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077211() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Work</p>
      </div>
    </div>
  );
}

function Frame631() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <ListCheck1 />
      <Frame1984077211 />
    </div>
  );
}

function PriceTagLine1() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="price-tag-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="price-tag-line">
          <path d={svgPaths.p1e646b80} fill="var(--fill-0, #E27100)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077212() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#e27100] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">High</p>
      </div>
    </div>
  );
}

function Frame632() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <PriceTagLine1 />
      <Frame1984077212 />
    </div>
  );
}

function Frame633() {
  return (
    <div className="content-stretch flex gap-[9px] items-center justify-start relative shrink-0">
      <Frame630 />
      <Frame631 />
      <Frame632 />
    </div>
  );
}

function Frame615() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-bl-[8px] rounded-tl-[8px] shrink-0">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-[12px] relative w-full">
          <Frame1984077266 />
          <Frame633 />
        </div>
      </div>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="bg-[#fcfcfc] content-stretch flex items-start justify-start relative rounded-[8px] shrink-0 w-full" data-name="list item">
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame615 />
    </div>
  );
}

function Frame555() {
  return (
    <div className="content-stretch flex gap-4 items-start justify-start max-h-10 relative shrink-0 w-full">
      <div className="-webkit-box basis-0 css-1pl2q8 flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-neutral-950">
        <p className="leading-[1.4]">Pay Rent to owner</p>
      </div>
    </div>
  );
}

function Frame1984077267() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-start min-h-px min-w-px relative shrink-0">
      <Frame555 />
    </div>
  );
}

function StateLayer2() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="relative rounded-[2px] shrink-0 size-4" data-name="container">
        <div aria-hidden="true" className="absolute border border-[#929292] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
    </div>
  );
}

function Checkboxes2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-6" data-name="Checkboxes">
      <StateLayer2 />
    </div>
  );
}

function Checkbox2() {
  return (
    <div className="content-stretch flex gap-2 items-center justify-start relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="checkbox">
      <Checkboxes2 />
    </div>
  );
}

function Frame1984077269() {
  return (
    <div className="content-stretch flex gap-0.5 items-start justify-start relative shrink-0 w-full">
      <Frame1984077267 />
      <Checkbox2 />
    </div>
  );
}

function Alarm2() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="Alarm">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Alarm">
          <path d={svgPaths.p36d95180} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077214() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">12 Aug, Mon, 10:30 PM</p>
      </div>
    </div>
  );
}

function Frame635() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <Alarm2 />
      <Frame1984077214 />
    </div>
  );
}

function ListCheck2() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="list-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="list-check">
          <path d={svgPaths.pdde6800} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077215() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Work</p>
      </div>
    </div>
  );
}

function Frame636() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <ListCheck2 />
      <Frame1984077215 />
    </div>
  );
}

function PriceTagLine2() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="price-tag-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="price-tag-line">
          <path d={svgPaths.p1e646b80} fill="var(--fill-0, #E27100)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077216() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#e27100] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">High</p>
      </div>
    </div>
  );
}

function Frame637() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <PriceTagLine2 />
      <Frame1984077216 />
    </div>
  );
}

function Frame638() {
  return (
    <div className="content-stretch flex gap-[9px] items-center justify-start relative shrink-0">
      <Frame635 />
      <Frame636 />
      <Frame637 />
    </div>
  );
}

function Frame616() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-bl-[8px] rounded-tl-[8px] shrink-0">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-[12px] relative w-full">
          <Frame1984077269 />
          <Frame638 />
        </div>
      </div>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="bg-[#fcfcfc] content-stretch flex items-start justify-start relative rounded-[8px] shrink-0 w-full" data-name="list item">
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame616 />
    </div>
  );
}

function ErrorWarningLine3() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="error-warning-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="error-warning-line">
          <path d={svgPaths.p34201500} fill="var(--fill-0, #D30000)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077217() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#d30000] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Missed</p>
      </div>
    </div>
  );
}

function Frame625() {
  return (
    <div className="content-stretch flex gap-0.5 items-center justify-center relative shrink-0">
      <ErrorWarningLine3 />
      <Frame1984077217 />
    </div>
  );
}

function Frame556() {
  return (
    <div className="content-stretch flex gap-4 items-start justify-start max-h-10 relative shrink-0 w-full">
      <div className="-webkit-box basis-0 css-opaqfo flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#939295] text-[14px]">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[1.4] line-through">Don’t keep stagnant water near your house.</p>
      </div>
    </div>
  );
}

function Frame1984077260() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-start min-h-px min-w-px relative shrink-0">
      <Frame625 />
      <Frame556 />
    </div>
  );
}

function DeleteBinLine3() {
  return (
    <div className="relative shrink-0 size-3" data-name="delete-bin-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="delete-bin-line">
          <path d={svgPaths.p30dbe380} fill="var(--fill-0, #D30000)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077270() {
  return (
    <div className="bg-[#ffeded] box-border content-stretch flex gap-2.5 items-center justify-start p-[4px] relative rounded-[4px] shrink-0">
      <DeleteBinLine3 />
    </div>
  );
}

function IconsCheckSmall() {
  return (
    <div className="absolute left-1/2 size-4 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icons/check_small">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons/check_small">
          <path d={svgPaths.p13190080} fill="var(--fill-0, white)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function StateLayer3() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="bg-[#a1a1a1] rounded-[2px] shrink-0 size-4" data-name="container" />
      <IconsCheckSmall />
    </div>
  );
}

function Checkboxes3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-6" data-name="Checkboxes">
      <StateLayer3 />
    </div>
  );
}

function Checkbox3() {
  return (
    <div className="content-stretch flex gap-2 items-center justify-start relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="checkbox">
      <Frame1984077270 />
      <Checkboxes3 />
    </div>
  );
}

function Frame1984077261() {
  return (
    <div className="content-stretch flex gap-0.5 items-start justify-start relative shrink-0 w-full">
      <Frame1984077260 />
      <Checkbox3 />
    </div>
  );
}

function Alarm3() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="Alarm">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Alarm">
          <path d={svgPaths.p36d95180} fill="var(--fill-0, #A8A4AC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077218() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#a8a4ac] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">12 Aug, Mon, 10:30 PM</p>
      </div>
    </div>
  );
}

function Frame639() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <Alarm3 />
      <Frame1984077218 />
    </div>
  );
}

function ListCheck3() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="list-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="list-check">
          <path d={svgPaths.pdde6800} fill="var(--fill-0, #A8A4AC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077219() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#a8a4ac] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Work</p>
      </div>
    </div>
  );
}

function Frame640() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <ListCheck3 />
      <Frame1984077219 />
    </div>
  );
}

function PriceTagLine3() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="price-tag-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="price-tag-line">
          <path d={svgPaths.p1e646b80} fill="var(--fill-0, #A8A4AC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077220() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#a8a4ac] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">High</p>
      </div>
    </div>
  );
}

function Frame627() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <PriceTagLine3 />
      <Frame1984077220 />
    </div>
  );
}

function Frame641() {
  return (
    <div className="content-center flex flex-wrap gap-[9px] items-center justify-start relative shrink-0 w-full">
      <Frame639 />
      <Frame640 />
      <Frame627 />
    </div>
  );
}

function Frame617() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-bl-[8px] rounded-tl-[8px] shrink-0">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-[12px] relative w-full">
          <Frame1984077261 />
          <Frame641 />
        </div>
      </div>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="bg-[#fcfcfc] content-stretch flex items-start justify-start relative rounded-[8px] shrink-0 w-full" data-name="list item">
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame617 />
    </div>
  );
}

function Frame557() {
  return (
    <div className="content-stretch flex gap-4 items-start justify-start max-h-10 relative shrink-0 w-full">
      <div className="-webkit-box basis-0 css-opaqfo flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#939295] text-[14px]">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[1.4] line-through">Lock the house</p>
      </div>
    </div>
  );
}

function Frame1984077271() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-0.5 grow items-start justify-start min-h-px min-w-px relative shrink-0">
      <Frame557 />
    </div>
  );
}

function DeleteBinLine4() {
  return (
    <div className="relative shrink-0 size-3" data-name="delete-bin-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="delete-bin-line">
          <path d={svgPaths.p30dbe380} fill="var(--fill-0, #D30000)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077272() {
  return (
    <div className="bg-[#ffeded] box-border content-stretch flex gap-2.5 items-center justify-start p-[4px] relative rounded-[4px] shrink-0">
      <DeleteBinLine4 />
    </div>
  );
}

function IconsCheckSmall1() {
  return (
    <div className="absolute left-1/2 size-4 top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Icons/check_small">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icons/check_small">
          <path d={svgPaths.p13190080} fill="var(--fill-0, white)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function StateLayer4() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="bg-[#a1a1a1] rounded-[2px] shrink-0 size-4" data-name="container" />
      <IconsCheckSmall1 />
    </div>
  );
}

function Checkboxes4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-6" data-name="Checkboxes">
      <StateLayer4 />
    </div>
  );
}

function Checkbox4() {
  return (
    <div className="content-stretch flex gap-2 items-center justify-start relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="checkbox">
      <Frame1984077272 />
      <Checkboxes4 />
    </div>
  );
}

function Frame1984077273() {
  return (
    <div className="content-stretch flex gap-0.5 items-start justify-start relative shrink-0 w-full">
      <Frame1984077271 />
      <Checkbox4 />
    </div>
  );
}

function Alarm4() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="Alarm">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Alarm">
          <path d={svgPaths.p36d95180} fill="var(--fill-0, #A8A4AC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077223() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#a8a4ac] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">12 Aug, Mon, 10:30 PM</p>
      </div>
    </div>
  );
}

function Frame643() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <Alarm4 />
      <Frame1984077223 />
    </div>
  );
}

function ListCheck4() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="list-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="list-check">
          <path d={svgPaths.pdde6800} fill="var(--fill-0, #A8A4AC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077224() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#a8a4ac] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Work</p>
      </div>
    </div>
  );
}

function Frame644() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <ListCheck4 />
      <Frame1984077224 />
    </div>
  );
}

function PriceTagLine4() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="price-tag-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="price-tag-line">
          <path d={svgPaths.p1e646b80} fill="var(--fill-0, #A8A4AC)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077225() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-center justify-center pb-0 pt-0.5 px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#a8a4ac] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">High</p>
      </div>
    </div>
  );
}

function Frame646() {
  return (
    <div className="box-border content-stretch flex gap-0.5 items-center justify-center px-0 py-1 relative shrink-0">
      <PriceTagLine4 />
      <Frame1984077225 />
    </div>
  );
}

function Frame647() {
  return (
    <div className="content-center flex flex-wrap gap-[9px] items-center justify-start relative shrink-0 w-full">
      <Frame643 />
      <Frame644 />
      <Frame646 />
    </div>
  );
}

function Frame618() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative rounded-bl-[8px] rounded-tl-[8px] shrink-0">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-[12px] relative w-full">
          <Frame1984077273 />
          <Frame647 />
        </div>
      </div>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="bg-[#fcfcfc] content-stretch flex items-start justify-start relative rounded-[8px] shrink-0 w-full" data-name="list item">
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame618 />
    </div>
  );
}

function Frame648() {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0 w-full">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
      <ListItem4 />
    </div>
  );
}

function Frame629() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col items-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-6 items-center justify-start px-4 py-0 relative w-full">
          <Frame648 />
        </div>
      </div>
    </div>
  );
}

function Frame1984077256() {
  return (
    <div className="absolute content-stretch flex flex-col gap-3 items-start justify-start left-0 top-0 w-[360px]">
      <Frame1984077255 />
      <Frame629 />
    </div>
  );
}

function Left() {
  return (
    <div className="absolute contents left-[70px] translate-y-[-50%]" data-name="Left" style={{ top: "calc(50% - 1px)" }}>
      <div className="absolute flex h-[9.984px] items-center justify-center left-[70px] translate-y-[-50%] w-[0px]" style={{ top: "calc(50% - 1px)" }}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-2.5">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 2">
                <line id="Line 1" stroke="var(--stroke-0, #898989)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="1" x2="9" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[9.984px] items-center justify-center left-[74px] translate-y-[-50%] w-[0px]" style={{ top: "calc(50% - 1px)" }}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-2.5">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 2">
                <line id="Line 1" stroke="var(--stroke-0, #898989)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="1" x2="9" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[9.984px] items-center justify-center left-[78px] translate-y-[-50%] w-[0px]" style={{ top: "calc(50% - 1px)" }}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-2.5">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 2">
                <line id="Line 1" stroke="var(--stroke-0, #898989)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="1" x2="9" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomPhoneIcons() {
  return (
    <div className="absolute contents left-[70px] translate-y-[-50%]" data-name="Bottom Phone Icons" style={{ top: "calc(50% - 1.5px)" }}>
      <div className="absolute h-[13px] right-[71px] translate-y-[-50%] w-[7.8px]" data-name="Right" style={{ top: "calc(50% - 1.5px)" }}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 13">
          <path d={svgPaths.p213ee380} fill="var(--fill-0, #898989)" id="Right" />
        </svg>
      </div>
      <div className="absolute h-[9px] rounded-[5px] translate-x-[-50%] translate-y-[-50%] w-[8.4px]" data-name="Centre" style={{ top: "calc(50% - 1.5px)", left: "calc(50% - 0.5px)" }}>
        <div aria-hidden="true" className="absolute border-[#898989] border-[2.25px] border-solid inset-[-1.125px] pointer-events-none rounded-[6.125px]" />
      </div>
      <Left />
    </div>
  );
}

function Group1038() {
  return (
    <div className="absolute contents left-[70px] translate-y-[-50%]" style={{ top: "calc(50% - 1.5px)" }}>
      <BottomPhoneIcons />
    </div>
  );
}

function Frame1984077250() {
  return (
    <div className="h-8 relative shrink-0 w-full">
      <Group1038 />
    </div>
  );
}

function NavBar() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col items-start justify-start translate-x-[-50%] w-[361px]" data-name="Nav Bar" style={{ left: "calc(50% + 0.5px)" }}>
      <Frame1984077250 />
    </div>
  );
}

export default function ToDoListpage() {
  return (
    <div className="bg-white overflow-clip relative rounded-[16px] size-full" data-name="To-do listpage">
      <Frame1984077256 />
      <NavBar />
    </div>
  );
}