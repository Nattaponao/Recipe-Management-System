'use client'
import React from 'react'
import Image from 'next/image'


function HeroPage() {

  return (
    <div  className={`bg-[#637402] pb-14`}>
      <div className="flex flex-col md:flex-row justify-between items-center text-white">
        <div className="pl-6 md:pl-19  w-full md:w-auto ">
          <div className={`text-[48px] font-semibold leading-tight md:text-[100px] md:leading-28 mb-8 md:mb-16 md:pt-10e `}>
            <h1>Pad Krapao</h1>
            <h1>Moo sub</h1>
          </div>
          <hr className="opacity-65" />
          <div className="font-extralight flex flex-col md:flex-row md:items-center mt-4 opacity-65 relative">         
            <div className="text-[12px] flex gap-4 pl-0 md:pl-16 mb-2 md:mb-0">
              <button className="border rounded-2xl py-1.5 px-7">How to</button>
              <button className="border rounded-2xl py-1.5 px-7">Baking</button>
            </div>
            <p className="text-[14px] md:absolute md:right-0">
              12 min read
            </p>
          </div>
          <div className="text-[#DFD3A4] font-extralight pl-0 md:pl-16">
            <button className="bg-[#1C1C1E] py-2 px-6 rounded-3xl mt-9 text-[16px] md:text-[18px] cursor-pointer">
              READ NOW
            </button>
          </div>
        </div>
        <div className="mt-10 md:mt-0 w-full md:w-auto flex justify-center ">
          <Image
            src="/kapao.jpeg"
            alt="kapao"
            width={800}
            height={800}
            className="w-[90%] md:w-[800px] h-auto "
          />
        </div>
      </div>
    </div>
  )
}

export default HeroPage
