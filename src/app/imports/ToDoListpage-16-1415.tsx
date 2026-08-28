import svgPaths from "./svg-mfiqwqjfyn";

function MobileSignal() {
  return (
    <div className="absolute h-[9.23px] right-[72.39px] top-[calc(50%+3.231px)] translate-y-[-50%] w-[16.615px]" data-name="Mobile Signal">
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
    <div className="absolute h-[10.122px] right-[53.67px] top-[calc(50%+2.292px)] translate-y-[-50%] w-[14.098px]" data-name="Wifi">
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
    <div className="absolute contents right-[23.48px] top-[calc(50%+2.309px)] translate-y-[-50%]" data-name="Battery">
      <div className="absolute h-[12px] right-[25.31px] top-[calc(50%+2.308px)] translate-y-[-50%] w-[23.077px]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 12">
          <path d={svgPaths.p2736f680} id="Rectangle" opacity="0.35" stroke="var(--stroke-0, #090A0A)" strokeWidth="0.923077" />
        </svg>
      </div>
      <div className="absolute h-[3.692px] right-[23.48px] top-[calc(50%+2.769px)] translate-y-[-50%] w-[1.226px]" data-name="Combined Shape">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 4">
          <path d={svgPaths.peff8440} fill="var(--fill-0, #090A0A)" id="Combined Shape" opacity="0.4" />
        </svg>
      </div>
      <div className="absolute h-[7.689px] right-[27.61px] top-[calc(50%+2.306px)] translate-y-[-50%] w-[18.646px]" data-name="Rectangle">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 8">
          <path d={svgPaths.p29b7e780} fill="var(--fill-0, #090A0A)" id="Rectangle" />
        </svg>
      </div>
    </div>
  );
}

function Battery1() {
  return (
    <div className="absolute contents right-[23.48px] top-[calc(50%+2.308px)] translate-y-[-50%]" data-name="Battery">
      <Battery />
    </div>
  );
}

function NativeStatusBar() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Native / Status Bar">
      <div className="absolute flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] left-[27.69px] not-italic text-[#090a0a] text-[14.769px] text-nowrap top-[calc(50%+1.962px)] translate-y-[-50%]">
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="flex flex-col font-['Nunito:Bold',_sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[20px] text-black text-nowrap">
        <p className="leading-[1.2] whitespace-pre">To-do list</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[274px] items-center relative shrink-0">
      <Frame645 />
    </div>
  );
}

function Frame1984077210() {
  return (
    <div className="content-stretch flex gap-[52px] items-center relative shrink-0">
      <Frame3 />
    </div>
  );
}

function FunnelSimple() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="FunnelSimple">
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
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]" data-name="Depth 3, Frame 0">
      <FunnelSimple />
    </div>
  );
}

function Frame1984077221() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between pl-[16px] pr-[20px] py-[8px] relative w-full">
          <Frame1984077210 />
          <Depth3Frame0 />
        </div>
      </div>
    </div>
  );
}

function Frame1984077255() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <NativeStatusBar />
      <Frame1984077221 />
    </div>
  );
}

function Frame1984077266() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 126 1">
            <line id="Line 5" stroke="var(--stroke-0, #EFEFEF)" x2="125.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] overflow-ellipsis overflow-hidden whitespace-pre">12 Aug, Fri</p>
      </div>
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 126 1">
            <line id="Line 5" stroke="var(--stroke-0, #EFEFEF)" x2="125.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function StateLayer() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="relative rounded-[2px] shrink-0 size-[16px]" data-name="container">
        <div aria-hidden="true" className="absolute border border-[#929292] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
    </div>
  );
}

function Checkboxes() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-name="Checkboxes">
      <StateLayer />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="checkbox">
      <Checkboxes />
    </div>
  );
}

function Frame553() {
  return (
    <div className="content-stretch flex gap-[16px] items-start max-h-[40px] relative shrink-0 w-full">
      <div className="-webkit-box basis-0 css-1pl2q8 flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-neutral-950">
        <p className="leading-[1.4]">Sanitise your hands when you come home from outside</p>
      </div>
    </div>
  );
}

function Frame1984077262() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame553 />
    </div>
  );
}

function Frame1984077263() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Checkbox />
      <Frame1984077262 />
    </div>
  );
}

function Alarm() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Alarm">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Alarm">
          <path d={svgPaths.p36d95180} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077204() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">10:30 PM</p>
      </div>
    </div>
  );
}

function Frame622() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
      <Alarm />
      <Frame1984077204 />
    </div>
  );
}

function ListCheck() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="list-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="list-check">
          <path d={svgPaths.pdde6800} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077205() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Work</p>
      </div>
    </div>
  );
}

function Frame623() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
      <ListCheck />
      <Frame1984077205 />
    </div>
  );
}

function PriceTagLine() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="price-tag-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="price-tag-line">
          <path d={svgPaths.p1e646b80} fill="var(--fill-0, #E27100)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077206() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#e27100] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">High</p>
      </div>
    </div>
  );
}

function Frame624() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
      <PriceTagLine />
      <Frame1984077206 />
    </div>
  );
}

function Frame621() {
  return (
    <div className="box-border content-stretch flex gap-[9px] items-center pl-[36px] pr-0 py-0 relative shrink-0">
      <Frame622 />
      <Frame623 />
      <Frame624 />
    </div>
  );
}

function Frame614() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[2px] items-start p-[12px] relative w-full">
          <Frame1984077263 />
          <Frame621 />
        </div>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="list item">
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame614 />
    </div>
  );
}

function StateLayer1() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="relative rounded-[2px] shrink-0 size-[16px]" data-name="container">
        <div aria-hidden="true" className="absolute border border-[#929292] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
    </div>
  );
}

function Checkboxes1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-name="Checkboxes">
      <StateLayer1 />
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="checkbox">
      <Checkboxes1 />
    </div>
  );
}

function Frame554() {
  return (
    <div className="content-stretch flex gap-[16px] items-start max-h-[40px] relative shrink-0 w-full">
      <div className="-webkit-box basis-0 css-1pl2q8 flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-neutral-950">
        <p className="leading-[1.4]">Wash daily Clothes</p>
      </div>
    </div>
  );
}

function Frame1984077264() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame554 />
    </div>
  );
}

function Frame1984077265() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Checkbox1 />
      <Frame1984077264 />
    </div>
  );
}

function Alarm1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Alarm">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Alarm">
          <path d={svgPaths.p36d95180} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077207() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">10:30 PM</p>
      </div>
    </div>
  );
}

function Frame626() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
      <Alarm1 />
      <Frame1984077207 />
    </div>
  );
}

function ListCheck1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="list-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="list-check">
          <path d={svgPaths.pdde6800} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077208() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Work</p>
      </div>
    </div>
  );
}

function Frame627() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
      <ListCheck1 />
      <Frame1984077208 />
    </div>
  );
}

function PriceTagLine1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="price-tag-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="price-tag-line">
          <path d={svgPaths.p1e646b80} fill="var(--fill-0, #E27100)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077209() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#e27100] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">High</p>
      </div>
    </div>
  );
}

function Frame628() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
      <PriceTagLine1 />
      <Frame1984077209 />
    </div>
  );
}

function Frame629() {
  return (
    <div className="box-border content-stretch flex gap-[9px] items-center pl-[36px] pr-0 py-0 relative shrink-0">
      <Frame626 />
      <Frame627 />
      <Frame628 />
    </div>
  );
}

function Frame615() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[2px] items-start p-[12px] relative w-full">
          <Frame1984077265 />
          <Frame629 />
        </div>
      </div>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="list item">
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame615 />
    </div>
  );
}

function Frame1984077267() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 129 1">
            <line id="Line 5" stroke="var(--stroke-0, #EFEFEF)" x2="129" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] overflow-ellipsis overflow-hidden whitespace-pre">Yesterday</p>
      </div>
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 129 1">
            <line id="Line 5" stroke="var(--stroke-0, #EFEFEF)" x2="129" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function StateLayer2() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0" data-name="state-layer">
      <div className="relative rounded-[2px] shrink-0 size-[16px]" data-name="container">
        <div aria-hidden="true" className="absolute border border-[#929292] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
    </div>
  );
}

function Checkboxes2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-name="Checkboxes">
      <StateLayer2 />
    </div>
  );
}

function Checkbox2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative rounded-br-[8px] rounded-tr-[8px] shrink-0" data-name="checkbox">
      <Checkboxes2 />
    </div>
  );
}

function Frame555() {
  return (
    <div className="content-stretch flex gap-[16px] items-start max-h-[40px] relative shrink-0 w-full">
      <div className="-webkit-box basis-0 css-1pl2q8 flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-neutral-950">
        <p className="leading-[1.4]">Pay Rent to owner</p>
      </div>
    </div>
  );
}

function Frame1984077269() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame555 />
    </div>
  );
}

function Frame1984077270() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
      <Checkbox2 />
      <Frame1984077269 />
    </div>
  );
}

function Alarm2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Alarm">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Alarm">
          <path d={svgPaths.p36d95180} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077211() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">10:30 PM</p>
      </div>
    </div>
  );
}

function Frame630() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
      <Alarm2 />
      <Frame1984077211 />
    </div>
  );
}

function ListCheck2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="list-check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="list-check">
          <path d={svgPaths.pdde6800} fill="var(--fill-0, #4D4C4F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077212() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">Work</p>
      </div>
    </div>
  );
}

function Frame631() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
      <ListCheck2 />
      <Frame1984077212 />
    </div>
  );
}

function PriceTagLine2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="price-tag-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="price-tag-line">
          <path d={svgPaths.p1e646b80} fill="var(--fill-0, #E27100)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame1984077213() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#e27100] text-[12px] text-nowrap">
        <p className="leading-[1.4] whitespace-pre">High</p>
      </div>
    </div>
  );
}

function Frame632() {
  return (
    <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
      <PriceTagLine2 />
      <Frame1984077213 />
    </div>
  );
}

function Frame633() {
  return (
    <div className="box-border content-stretch flex gap-[9px] items-center pl-[36px] pr-0 py-0 relative shrink-0">
      <Frame630 />
      <Frame631 />
      <Frame632 />
    </div>
  );
}

function Frame616() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[2px] items-start p-[12px] relative w-full">
          <Frame1984077270 />
          <Frame633 />
        </div>
      </div>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full" data-name="list item">
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Frame616 />
    </div>
  );
}

function Frame1984077268() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 140 1">
            <line id="Line 5" stroke="var(--stroke-0, #EFEFEF)" x2="139.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] overflow-ellipsis overflow-hidden whitespace-pre">Today</p>
      </div>
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 140 1">
            <line id="Line 5" stroke="var(--stroke-0, #EFEFEF)" x2="139.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame625() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start px-[16px] py-0 relative w-full">
          <Frame1984077266 />
          <ListItem />
          <ListItem1 />
          <Frame1984077267 />
          <ListItem2 />
          <ListItem2 />
          <Frame1984077268 />
          <ListItem2 />
        </div>
      </div>
    </div>
  );
}

function Frame1984077256() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-0 top-0 w-[360px]">
      <Frame1984077255 />
      <Frame625 />
    </div>
  );
}

function Left() {
  return (
    <div className="absolute contents left-[70px] top-[calc(50%-1px)] translate-y-[-50%]" data-name="Left">
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[70px] top-[calc(50%-1px)] translate-y-[-50%] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "9.984375", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[10px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 2">
                <line id="Line 1" stroke="var(--stroke-0, #898989)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="1" x2="9" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[74px] top-[calc(50%-1px)] translate-y-[-50%] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "9.984375", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[10px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-2px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 2">
                <line id="Line 1" stroke="var(--stroke-0, #898989)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="1" x2="9" y1="1" y2="1" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[78px] top-[calc(50%-1px)] translate-y-[-50%] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "9.984375", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[10px]">
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
    <div className="absolute contents left-[70px] top-[calc(50%-1.5px)] translate-y-[-50%]" data-name="Bottom Phone Icons">
      <div className="absolute h-[13px] right-[71px] top-[calc(50%-1.5px)] translate-y-[-50%] w-[7.8px]" data-name="Right">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 13">
          <path d={svgPaths.p213ee380} fill="var(--fill-0, #898989)" id="Right" />
        </svg>
      </div>
      <div className="absolute h-[9px] left-[calc(50%-0.5px)] rounded-[5px] top-[calc(50%-1.5px)] translate-x-[-50%] translate-y-[-50%] w-[8.4px]" data-name="Centre">
        <div aria-hidden="true" className="absolute border-[#898989] border-[2.25px] border-solid inset-[-1.125px] pointer-events-none rounded-[6.125px]" />
      </div>
      <Left />
    </div>
  );
}

function Group1038() {
  return (
    <div className="absolute contents left-[70px] top-[calc(50%-1.5px)] translate-y-[-50%]">
      <BottomPhoneIcons />
    </div>
  );
}

function Frame1984077250() {
  return (
    <div className="h-[32px] relative shrink-0 w-full">
      <Group1038 />
    </div>
  );
}

function NavBar() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col items-start left-[calc(50%+0.5px)] translate-x-[-50%] w-[361px]" data-name="Nav Bar">
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