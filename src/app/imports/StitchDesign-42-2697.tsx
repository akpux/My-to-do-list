import svgPaths from "./svg-hs3v5gtr53";

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
    <div className="absolute h-[10.123px] right-[53.67px] top-[calc(50%+2.292px)] translate-y-[-50%] w-[14.098px]" data-name="Wifi">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 11">
        <g id="Wifi">
          <path d={svgPaths.p3b5ffdf2} fill="var(--fill-0, #090A0A)" id="Union" />
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
    <div className="bg-white h-[40px] relative shrink-0 w-full" data-name="Native / Status Bar">
      <div className="absolute flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] left-[27.69px] not-italic text-[#090a0a] text-[14.769px] text-nowrap top-[calc(50%+1.962px)] translate-y-[-50%]">
        <p className="leading-[14.769px] whitespace-pre">9:41</p>
      </div>
      <MobileSignal />
      <Wifi />
      <Battery1 />
    </div>
  );
}

function Depth4Frame0() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Depth 4, Frame 0">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_36_2583)" id="Depth 4, Frame 0">
          <path clipRule="evenodd" d={svgPaths.p10c4b680} fill="var(--fill-0, #0D141C)" fillRule="evenodd" id="Vector - 0" />
          <g id="Depth 5, Frame 0"></g>
        </g>
        <defs>
          <clipPath id="clip0_36_2583">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Depth3Frame0() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[32px]" data-name="Depth 3, Frame 0">
      <Depth4Frame0 />
    </div>
  );
}

function Depth3Frame1() {
  return (
    <div className="box-border content-stretch flex flex-col items-center pl-0 pr-[48px] py-0 relative shrink-0 w-[296px]" data-name="Depth 3, Frame 1">
      <p className="css-qkn6g0 font-['Nunito:Bold',_sans-serif] font-bold leading-[23px] relative shrink-0 text-[#0d141c] text-[20px] w-full">New Task</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <Depth3Frame0 />
      <Depth3Frame1 />
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

function Frame1984077221() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between pl-[16px] pr-[20px] py-[8px] relative w-full">
          <Frame1984077210 />
        </div>
      </div>
    </div>
  );
}

function Wrapper() {
  return (
    <div className="relative shrink-0 w-[360px]" data-name="wrapper">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-[360px]">
        <NativeStatusBar />
        <Frame1984077221 />
      </div>
    </div>
  );
}

function Depth4Frame1() {
  return (
    <div className="h-[56px] relative rounded-[8px] shrink-0 w-[358px]" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[56px] items-center overflow-clip pb-[17px] pt-[16px] px-0 relative rounded-[inherit] w-[358px]">
        <p className="basis-0 css-edbsbm font-['Nunito:Regular',_sans-serif] font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[#8e8e8e] text-[16px]">Task Title</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#8e96a0] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Wrapper1() {
  return (
    <div className="max-w-[480px] relative shrink-0 w-full" data-name="wrapper">
      <div className="flex flex-row items-end max-w-inherit size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-end flex flex-wrap gap-[16px] items-end max-w-inherit px-[16px] py-[12px] relative w-full">
          <Depth4Frame1 />
        </div>
      </div>
    </div>
  );
}

function Depth2Frame2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 2">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start pb-[4px] pt-[16px] px-[16px] relative w-full">
          <p className="css-qkn6g0 font-['Nunito:SemiBold',_sans-serif] font-semibold leading-[23px] relative shrink-0 text-[#0d141c] text-[16px] w-full">Task Type</p>
        </div>
      </div>
    </div>
  );
}

function Depth4Frame2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <p className="css-b7kb1z font-['Nunito:SemiBold',_sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[#8e1ffd] text-[14px] text-center w-full">Work</p>
      </div>
    </div>
  );
}

function Depth3Frame3() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Depth 3, Frame 0">
      <div aria-hidden="true" className="absolute border border-[#8e1ffd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center justify-center p-[9px] relative">
        <Depth4Frame2 />
      </div>
    </div>
  );
}

function Depth4Frame3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <p className="css-8mkgpx font-['Nunito:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#9a959c] text-[14px] text-center w-full">Home</p>
      </div>
    </div>
  );
}

function Depth3Frame4() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Depth 3, Frame 1">
      <div aria-hidden="true" className="absolute border border-[#8e96a0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center justify-center p-[9px] relative">
        <Depth4Frame3 />
      </div>
    </div>
  );
}

function Depth4Frame4() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="css-8mkgpx font-['Nunito:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#9a959c] text-[14px] text-center text-nowrap whitespace-pre">Random</p>
      </div>
    </div>
  );
}

function Depth3Frame2() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Depth 3, Frame 2">
      <div aria-hidden="true" className="absolute border border-[#8e96a0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center justify-center p-[9px] relative">
        <Depth4Frame4 />
      </div>
    </div>
  );
}

function Depth2Frame3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 3">
      <div className="size-full">
        <div className="box-border content-start flex flex-wrap gap-[12px] items-start pl-[12px] pr-[16px] py-[12px] relative w-full">
          <Depth3Frame3 />
          <Depth3Frame4 />
          <Depth3Frame2 />
        </div>
      </div>
    </div>
  );
}

function Frame1984077257() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Depth2Frame2 />
      <Depth2Frame3 />
    </div>
  );
}

function Wrapper2() {
  return (
    <div className="relative shrink-0 w-full" data-name="wrapper">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Frame1984077257 />
      </div>
    </div>
  );
}

function Depth2Frame6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 2">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start pb-[4px] pt-[16px] px-[16px] relative w-full">
          <p className="css-qkn6g0 font-['Nunito:SemiBold',_sans-serif] font-semibold leading-[23px] relative shrink-0 text-[#0d141c] text-[16px] w-full">Priority</p>
        </div>
      </div>
    </div>
  );
}

function Depth4Frame5() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <p className="css-b7kb1z font-['Nunito:SemiBold',_sans-serif] font-semibold leading-[1.4] relative shrink-0 text-[#8e1ffd] text-[14px] text-center w-full">High</p>
      </div>
    </div>
  );
}

function Depth3Frame5() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Depth 3, Frame 0">
      <div aria-hidden="true" className="absolute border border-[#8e1ffd] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center justify-center p-[9px] relative">
        <Depth4Frame5 />
      </div>
    </div>
  );
}

function Depth4Frame6() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <p className="css-8mkgpx font-['Nunito:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#9a959c] text-[14px] text-center text-nowrap whitespace-pre">Medium</p>
      </div>
    </div>
  );
}

function Depth3Frame6() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Depth 3, Frame 1">
      <div aria-hidden="true" className="absolute border border-[#8e96a0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center justify-center p-[9px] relative">
        <Depth4Frame6 />
      </div>
    </div>
  );
}

function Depth4Frame7() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="css-8mkgpx font-['Nunito:Regular',_sans-serif] font-normal leading-[1.4] relative shrink-0 text-[#9a959c] text-[14px] text-center text-nowrap whitespace-pre">Low</p>
      </div>
    </div>
  );
}

function Depth3Frame7() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Depth 3, Frame 2">
      <div aria-hidden="true" className="absolute border border-[#8e96a0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] items-center justify-center p-[9px] relative">
        <Depth4Frame7 />
      </div>
    </div>
  );
}

function Depth2Frame7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 3">
      <div className="size-full">
        <div className="box-border content-start flex flex-wrap gap-[12px] items-start pl-[12px] pr-[16px] py-[12px] relative w-full">
          <Depth3Frame5 />
          <Depth3Frame6 />
          <Depth3Frame7 />
        </div>
      </div>
    </div>
  );
}

function Frame1984077259() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Depth2Frame6 />
      <Depth2Frame7 />
    </div>
  );
}

function Wrapper3() {
  return (
    <div className="relative shrink-0 w-full" data-name="wrapper">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Frame1984077259 />
      </div>
    </div>
  );
}

function Depth2Frame4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 4">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-center pb-[4px] pt-[16px] px-[16px] relative w-full">
          <p className="css-qkn6g0 font-['Nunito:SemiBold',_sans-serif] font-semibold leading-[23px] relative shrink-0 text-[#0d141c] text-[16px] w-full">Deadline</p>
        </div>
      </div>
    </div>
  );
}

function Depth4Frame8() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="css-qkn6g0 font-['Nunito:Regular',_sans-serif] font-normal leading-[21px] relative shrink-0 text-[#0d141c] text-[14px] text-center text-nowrap whitespace-pre">12 Aug</p>
      </div>
    </div>
  );
}

function ArrowDownSFill() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-down-s-fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="arrow-down-s-fill">
          <path d={svgPaths.p21637080} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Depth3Frame8() {
  return (
    <div className="bg-[#fbfbfb] h-[32px] relative rounded-[8px] shrink-0" data-name="Depth 3, Frame 0">
      <div aria-hidden="true" className="absolute border border-[#c4c4c4] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[17px] py-px relative">
        <Depth4Frame8 />
        <ArrowDownSFill />
      </div>
    </div>
  );
}

function Depth4Frame9() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="css-qkn6g0 font-['Nunito:Regular',_sans-serif] font-normal leading-[21px] relative shrink-0 text-[#0d141c] text-[14px] text-center text-nowrap whitespace-pre">Mon</p>
      </div>
    </div>
  );
}

function ArrowDownSFill1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-down-s-fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="arrow-down-s-fill">
          <path d={svgPaths.p21637080} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Depth3Frame9() {
  return (
    <div className="bg-[#fbfbfb] h-[32px] relative rounded-[8px] shrink-0" data-name="Depth 3, Frame 1">
      <div aria-hidden="true" className="absolute border border-[#c4c4c4] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[17px] py-px relative">
        <Depth4Frame9 />
        <ArrowDownSFill1 />
      </div>
    </div>
  );
}

function Depth4Frame10() {
  return (
    <div className="relative shrink-0" data-name="Depth 4, Frame 0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative">
        <p className="css-qkn6g0 font-['Nunito:Regular',_sans-serif] font-normal leading-[21px] relative shrink-0 text-[#0d141c] text-[14px] text-center text-nowrap whitespace-pre">10:30 PM</p>
      </div>
    </div>
  );
}

function ArrowDownSFill2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="arrow-down-s-fill">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="arrow-down-s-fill">
          <path d={svgPaths.p21637080} fill="var(--fill-0, black)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Depth3Frame10() {
  return (
    <div className="bg-[#fbfbfb] h-[32px] relative rounded-[8px] shrink-0" data-name="Depth 3, Frame 2">
      <div aria-hidden="true" className="absolute border border-[#c4c4c4] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[4px] h-[32px] items-center justify-center px-[17px] py-px relative">
        <Depth4Frame10 />
        <ArrowDownSFill2 />
      </div>
    </div>
  );
}

function Depth2Frame5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Depth 2, Frame 5">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center pl-[12px] pr-[16px] py-[12px] relative w-full">
          <Depth3Frame8 />
          <p className="css-qkn6g0 font-['Inter:Medium',_sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#0d141c] text-[14px] text-nowrap whitespace-pre">:</p>
          <Depth3Frame9 />
          <p className="css-qkn6g0 font-['Inter:Medium',_sans-serif] font-medium leading-[21px] not-italic relative shrink-0 text-[#0d141c] text-[14px] text-nowrap whitespace-pre">:</p>
          <Depth3Frame10 />
        </div>
      </div>
    </div>
  );
}

function Frame1984077258() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Depth2Frame4 />
      <Depth2Frame5 />
    </div>
  );
}

function Wrapper4() {
  return (
    <div className="relative shrink-0 w-full" data-name="wrapper">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Frame1984077258 />
      </div>
    </div>
  );
}

function MainSection() {
  return (
    <div className="relative shrink-0 w-full" data-name="Main section">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start relative w-full">
        <Wrapper />
        <Wrapper1 />
        <Wrapper2 />
        <Wrapper3 />
        <Wrapper4 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="basis-0 bg-[#8e1ffd] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[13px] items-center justify-center px-[24px] py-[12px] relative w-full">
          <div className="flex flex-col font-['Nunito:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#fcfcfc] text-[16px] text-nowrap">
            <p className="leading-[24px] whitespace-pre">Create To-do list</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomSheet() {
  return (
    <div className="relative shrink-0 w-full" data-name="Bottom sheet">
      <div className="size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start p-[16px] relative w-full">
          <Button />
        </div>
      </div>
    </div>
  );
}

function ScreenContainer() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[800px] items-start justify-between left-0 overflow-clip top-0 w-[360px]" data-name="Screen container">
      <MainSection />
      <BottomSheet />
    </div>
  );
}

export default function StitchDesign() {
  return (
    <div className="bg-white relative size-full" data-name="Stitch Design">
      <ScreenContainer />
    </div>
  );
}