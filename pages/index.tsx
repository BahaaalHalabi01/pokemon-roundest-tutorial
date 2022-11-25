import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
   <div className='h-screen w-screen flex flex-col justify-center items-center'>
    <div className=' text-2xl text-center '>Which Pokemon is rounder ?</div>
    <div className='border rounded p-8 flex justify-between max-w-3xl items-center mt-2'>
      <div className='w-16 h-16 bg-red-200'></div>
    <div className='p-8'>Vs</div>
      <div className='w-16 h-16 bg-red-200'></div>

      </div>
    
    </div>
    
  )
}
