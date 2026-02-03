import React from 'react'
import Image from 'next/image'
function RecipeOfWeek() {
  // <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#db0101" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"/></svg>
  return (
    <div className='bg-[#F9F7EB]'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-2 py-20 gap-5'>
          <div className='bg-[#FEFEF6] p-5 rounded-2xl'>
            <h1 className='text-[30px] font-semibold'>Recipe of Week</h1>
            <div className='flex justify-center'>
              <div className=''>
                <div className='my-7'>
                  <Image
                    src='/GreenSweet.jpeg'
                    alt='GreenSweet'
                    width={520}
                    height={500}
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <p className='text-[14px] font-semibold py-1 px-7 border rounded-3xl'>curry</p>
                  <p className='cursor-pointer'><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path fill="#1C1C1E" d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3" /></svg></p>
                </div>
                <hr className='border border-[#DFD3A4] my-6' />
                <div className='flex items-center gap-4'>
                  <div className="w-13 h-13 rounded-full overflow-hidden ">
                    <Image
                      src="/person01.jpeg"
                      alt="person"
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p>Peter Pan</p>
                    <p>March 20, 2022</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="flex flex-col h-full justify-between">
            <div>
              <div className='flex bg-[#FEFEF6] px-4 rounded-xl '>
                <div>
                  <Image
                    src='/tomyum.jpeg'
                    alt='Noodle'
                    width={275}
                    height={275}
                  />
                </div>
                <div className='p-7'>
                  <p>Noodle Chicken soup</p>
                  <p>Noodles</p>
                  <hr />
                  <div>
                    <Image
                      src='/GreenSweet.jpeg'
                      alt='GreenSweet'
                      width={18}
                      height={18}
                    />
                  </div>
                  <div>
                    <p>Peter Pan</p>
                    <p>March 20, 2022</p>
                  </div>
                </div>
              </div>

            </div>
            <div>
               <div className='flex bg-[#FEFEF6] px-4 rounded-xl '>
                <div>
                  <Image
                    src='/01.jpeg'
                    alt='Noodle'
                    width={275}
                    height={275}
                  />
                </div>
                <div className='p-7'>
                  <p>Noodle Chicken soup</p>
                  <p>Noodles</p>
                  <hr />
                  <div>
                    <Image
                      src='/GreenSweet.jpeg'
                      alt='GreenSweet'
                      width={18}
                      height={18}
                    />
                  </div>
                  <div>
                    <p>Peter Pan</p>
                    <p>March 20, 2022</p>
                  </div>
                </div>
              </div>

            </div>
            <div>
               <div className='flex bg-[#FEFEF6] px-4 rounded-xl '>
                <div>
                  <Image
                    src='/padthai.jpeg'
                    alt='Noodle'
                    width={275}
                    height={275}
                  />
                </div>
                <div className='p-7'>
                  <p>Noodle Chicken soup</p>
                  <p>Noodles</p>
                  <hr />
                  <div>
                    <Image
                      src='/GreenSweet.jpeg'
                      alt='GreenSweet'
                      width={18}
                      height={18}
                    />
                  </div>
                  <div>
                    <p>Peter Pan</p>
                    <p>March 20, 2022</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeOfWeek