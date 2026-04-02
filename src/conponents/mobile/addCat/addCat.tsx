//整个文件均由贺艳完成
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

type AddCatProps = {
  onSubmitted?: () => void
  onCancel?: () => void
}


export function AddCat ({ onSubmitted, onCancel }: AddCatProps) {
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
    //点击后进入下一页，绑定在下一步
    const addStep = async () => {
      if(step === 3){
        try {
          const res = await addCatFetch(form)
          if (res.code === 200) {
            onSubmitted?.()
          }
        } catch (error) {
          console.error('提交猫咪失败:', error)
        }
       return;
      }
      setStep(preStep => preStep += 1);
    }
    //点击后进入上一页，绑定在返回键
    const minusStep = () => {
      if(step === 1){
        onCancel?.()
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