import React from 'react'
import Image from 'next/image'
function HeroSection() {
  return (
    <div className='bg-[#F9F7EB] pb-20'>
      <div className='container mx-auto'>
        <div>
          <div className='leading-16 text-[#637402] '>
            <h1 className='text-[36px]'>IN MY</h1>
            <div className='flex items-center gap-7'>
              <h1 className='text-[106px] font-semibold '>KITCHEN</h1>
              <hr className='w-full border bg-[#637402]' />
            </div>
          </div>
          <div className='grid grid-cols-6 mt-16 place-items-center mb-16 text-[#101010]'>
            <div className='flex flex-col items-center gap-3 '>
              <div className='p-7 bg-[#DFD3A4] rounded-3xl '><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 384 512"><path fill="#637402" d="M192 496C86 496 0 394 0 288C0 176 64 16 192 16s192 160 192 272c0 106-86 208-192 208m-37.2-362c6.5-6 7-16.1 1-22.6s-16.1-7-22.6-1c-23.9 21.8-41.1 52.7-52.3 84.2S64 259.7 64 288c0 8.8 7.2 16 16 16s16-7.2 16-16c0-24.5 5-54.4 15.1-82.8c10.1-28.5 25-54.1 43.7-71.2" strokeWidth="13" stroke="#637402" /></svg></div>
              <p className='text-[21px] font-semibold'>Breakfast</p>
            </div>
             <div className='flex flex-col items-center gap-3'>
              <div className='p-7 bg-[#DFD3A4] rounded-3xl'><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 640 640"><path fill="#637402" d="M128 496V320c-35.3 0-64-28.7-64-64c0-216.5 512-216.5 512 0c0 35.3-28.7 64-64 64v176c0 26.5-21.5 48-48 48H176c-26.5 0-48-21.5-48-48" strokeWidth="16" stroke="#637402" /></svg></div>
              <p className='text-[21px] font-semibold'>Backing</p>
            </div>
             <div className='flex flex-col items-center gap-3'>
              <div className='p-7 bg-[#DFD3A4] rounded-3xl'><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 14 14"><path fill="#637402" fillRule="evenodd" d="M2.536.026a1.447 1.447 0 0 0-1.138 2.342L6.25 8.543v3.946H4a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H7.75V8.543l4.852-6.175A1.447 1.447 0 0 0 11.464.026zM9.805 3.5l1.55-1.974h-8.71L4.195 3.5z" clipRule="evenodd" /></svg></div>
              <p className='text-[21px] font-semibold'>Cocktails</p>
            </div>
             <div className='flex flex-col items-center gap-3'>
              <div className='p-7 bg-[#DFD3A4] rounded-3xl'><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 640 640"><path fill="#637402" d="M64 240c0-35.3 28.7-64 64-64h1.6c7.4-36.5 39.7-64 78.4-64c15 0 29 4.1 40.9 11.2C262.2 97.5 289 80 320 80s57.8 17.6 71.1 43.2c12-7.1 26-11.2 40.9-11.2c38.7 0 71 27.5 78.4 64h1.6c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32H72.6c-5.5-9.4-8.6-20.3-8.6-32m0 107.4c0-15.1 12.3-27.4 27.4-27.4h457.1c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1l-1.7 14.5c-2 16-15.6 28-31.8 28H204.2c-16.1 0-29.8-12-31.8-28l-1.8-14.4C108.4 478.1 64 417.9 64 347.4" strokeWidth="16" stroke="#637402" /></svg></div>
              <p className='text-[21px] font-semibold'>Curry</p>
            </div>
             <div className='flex flex-col items-center gap-3'>
              <div className='p-7 bg-[#DFD3A4] rounded-3xl'><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 20 20"><path fill="#637402" d="M4.505 2h-.013a.5.5 0 0 0-.176.036a.5.5 0 0 0-.31.388C3.99 2.518 3.5 5.595 3.5 7c0 .95.442 1.797 1.13 2.345c.25.201.37.419.37.601v.5q0 .027-.003.054c-.027.26-.151 1.429-.268 2.631C4.614 14.316 4.5 15.581 4.5 16a2 2 0 1 0 4 0c0-.42-.114-1.684-.229-2.869a302 302 0 0 0-.268-2.63L8 10.446v-.5c0-.183.12-.4.37-.601A3 3 0 0 0 9.5 7c0-1.408-.493-4.499-.506-4.577a.5.5 0 0 0-.355-.403A.5.5 0 0 0 8.51 2h-.02h.001a.505.505 0 0 0-.501.505v4a.495.495 0 0 1-.99.021V2.5a.5.5 0 0 0-1 0v4l.001.032a.495.495 0 0 1-.99-.027V2.506A.506.506 0 0 0 4.506 2M11 6.5A4.5 4.5 0 0 1 15.5 2a.5.5 0 0 1 .5.5v6.978l.02.224a626 626 0 0 1 .228 2.696c.124 1.507.252 3.161.252 3.602a2 2 0 1 1-4 0c0-.44.128-2.095.252-3.602c.062-.761.125-1.497.172-2.042l.03-.356H12.5A1.5 1.5 0 0 1 11 8.5zM8.495 2h-.004z" /></svg></div>
              <p className='text-[21px] font-semibold'>Noodle</p>
            </div>
             <div className='flex flex-col items-center gap-3'>
              <div className='p-7 bg-[#DFD3A4] rounded-3xl'><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24"><path fill="#637402" fillRule="evenodd" d="M8.5 2a1 1 0 0 0-.947.677l-.128.373a60 60 0 0 0-.762 2.303C6.338 6.422 6 7.699 6 8.57q0 .152.008.304a1 1 0 0 0 .035.415c.311 2.632 2.291 5.11 4.957 5.616V20H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-5.094c2.908-.552 5-3.451 5-6.335c0-.863-.328-2.127-.65-3.195a56 56 0 0 0-.907-2.71l-.002-.003A1 1 0 0 0 15.5 2zm-.443 6h7.887c-.088-.542-.273-1.266-.509-2.047A47 47 0 0 0 14.794 4H9.212c-.185.536-.42 1.223-.636 1.935c-.24.788-.429 1.519-.519 2.065" clipRule="evenodd" /></svg></div>
              <p className='text-[21px] font-semibold'>Drink</p>
            </div>
          </div>
          <div className=' text-[#637402]'>
            <div className='flex relative'>
               <h1 className='text-[36px] absolute right-85 font-semibold'>IN</h1>
            </div>

            <div className='flex items-center mt-2 gap-7'>    
              <hr className='w-full border bg-[#637402]'/>
              <h1 className='text-[106px] font-semibold border-[#637402]'>Popular</h1>     
            </div> 
            <div className='grid grid-cols-5  mt-10 place-items-center cards-focus '>
              <div className='bg-[#FEFEF6] rounded-3xl flex flex-col pt-6 w-60 card'>
                <div className='w-60'>
                  <Image
                    src='/GreenCurry.png'
                    alt='Green curry'
                    width={320}
                    height={300}
                    className='object-cover'
                  />
                </div>
                <div className='font-semibold p-6 h-32' >
                  <h1 className='text-black text-[18px] leading-5'>Green Curry</h1>
                  <p className='text-[#B0B0B0] text-[14px] leading-5'>All green and fresh soup</p>
                </div>
              </div>
             <div className='bg-[#FEFEF6] rounded-3xl flex flex-col pt-6 w-60 card'>
                <div className='w-60'>
                  <Image
                    src='/GreenCurry.png'
                    alt='Green curry'
                    width={320}
                    height={300}
                    className='object-cover'
                  />
                </div>
                <div className='font-semibold p-6 h-32' >
                  <h1 className='text-black text-[18px] leading-5'>Tom Yum Goong</h1>
                  <p className='text-[#B0B0B0] text-[14px] leading-5'>Gluten free with potato crust!</p>
                </div>
              </div>
              <div className='bg-[#FEFEF6] rounded-3xl flex flex-col pt-6 w-60 card'>
                <div className='w-60'>
                  <Image
                    src='/GreenCurry.png'
                    alt='Green curry'
                    width={320}
                    height={300}
                    className='object-cover'
                  />
                </div>
                <div className='font-semibold p-6 h-32' >
                  <h1 className='text-black text-[18px] leading-5'>Pad Thai</h1>
                  <p className='text-[#B0B0B0] text-[14px] leading-5'>Easy one-pot meal for dinners.</p>
                </div>
              </div>
              <div className='bg-[#FEFEF6] rounded-3xl flex flex-col pt-6 w-60 card'>
                <div className='w-60'>
                  <Image
                    src='/GreenCurry.png'
                    alt='Green curry'
                    width={320}
                    height={300}
                    className='object-cover'
                  />
                </div>
                <div className='font-semibold p-6 h-32' >
                  <h1 className='text-black text-[18px] leading-5'>Red pork over rice</h1>
                  <p className='text-[#B0B0B0] text-[14px] leading-5'>Fancy flavors and textures you need to try.</p>
                </div>
              </div>
             <div className='bg-[#FEFEF6] rounded-3xl flex flex-col pt-6 w-60 card'>
                <div className='w-60'>
                  <Image
                    src='/GreenCurry.png'
                    alt='Green curry'
                    width={320}
                    height={300}
                    className='object-cover'
                  />
                </div>
                <div className='font-semibold p-6 h-32 ' >
                  <h1 className='text-black text-[18px] leading-5'>Stir-fried Chicken with cashew nuts</h1>
                  <p className='text-[#B0B0B0] text-[14px] leading-5'>Springy, light and yet comforting bowl of pasta.</p>
                </div>
              </div>
            </div>     
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection