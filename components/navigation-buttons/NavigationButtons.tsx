import React from 'react'
import { Button } from '../ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NavigationButtons() {
    const router = useRouter()
  return (
    <div className='flex gap-2 fixed bottom-2 right-2 z-10 md:bottom-4 md:right-4'>
        <Button variant={"outline"} className='' onClick={()=>{router.back()}}>
            <ArrowLeft/>
        </Button>
        <Button variant={"outline"} onClick={()=>{router.forward()}}>
            <ArrowRight/>
        </Button>
    </div>
  )
}
