import style from './addCat.module.css'
import {AddCatNameimg} from './addCat1'
import { useState } from 'react'
import type {catData} from '../../../service/addCatFetch'
import  {addCatFetch} from '../../../service/addCatFetch'
import { Catgendertnr } from './addCat2'
import {CatDetailInfron} from './addCat3'

export type AddCatNameimgProps = {
  form: catData
  setForm: React.Dispatch<React.SetStateAction<catData>>
  minusStep: () => void
  addStep: () => void
}


export function AddCat () {
    const [form,setForm] = useState<catData>({
  name: '',
  gender:null ,
  neutered_status: null,
  birth_data: '',
  arrival_date: '',
  state: null,
  coat_color: null,
  position: '',
  story: '',
  avatar_key: '',
})
    const [step,setStep] = useState<number>(1)
    const addStep = () => {
      if(step === 3){
         addCatFetch(form);
       return;
      }
      setStep(preStep => preStep += 1);
    }
    const minusStep = () => {
      if(step === 1){
        //关闭这个卡片
       return;
      }
      setStep(preStep => preStep -= 1);
    }
  return(
    <div className={style.bannel}>
     {step === 1? <AddCatNameimg form={form} setForm={setForm}  addStep={addStep} minusStep={minusStep}/> : ''}
      {step === 2 ? <Catgendertnr form={form} setForm={setForm}  addStep={addStep} minusStep={minusStep}/> : ''}
       {step === 3 ? <CatDetailInfron form={form} setForm={setForm}  addStep={addStep} minusStep={minusStep}/> : ''}
    </div>
  )
}