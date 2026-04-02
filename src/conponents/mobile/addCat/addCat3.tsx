import {Select} from './selectCatDetail'
import style from './addCat3.module.css'
import type { AddCatNameimgProps } from './addCat'
import {useState} from 'react'
import {staterOptions, coatColorOptions} from '../../shared/data'
export function CatDetailInfron ({ form, setForm,  minusStep,addStep }: AddCatNameimgProps) {
  const[showstate,setShowState] = useState<boolean>(false);
    const[showcoat,setShowcoat] = useState<boolean>(false);
  //输入部分
    const Inputbirth = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        birth_data:e.target.value
      })
    }
     const Inputarrival = (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        arrival_date:e.target.value
      })
    }
    const Inputstory = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setForm({
        ...form,
        story:e.target.value
      })
    }

    
  return(
    <div className={style.wholeBannel}>
     {showstate?<Select datadetail={staterOptions} setForm={setForm} setShow={setShowState} filedName={'state'}/>: ''} 
      {showcoat?<Select datadetail={coatColorOptions} setForm={setForm} setShow={setShowcoat} filedName={'coat_color'}/>: ''} 

      <div className={style.toppart}>
         <span className={`iconfont icon-jiantou-zuo `} onClick={minusStep}></span>
      </div>
      <div className={style.item}>
        <h5 className={style.title}>TA的出生日期</h5>
        <div className={style.inputdetail}>
          {form.birth_data?<span className={style.text}>{form.birth_data}</span>:''}
         <input className={style.date} type='date' value={form.birth_data} onChange={Inputbirth}></input>
         <span className={`iconfont icon-jumao ${style.select}`}></span>
        </div>
      </div>
       <div className={style.item}>
        <h5 className={style.title}>TA的到家日期</h5>
          <div className={style.inputdetail}>
              {form.arrival_date?<span className={style.text}>{form.arrival_date}</span>:''}
         <input className={style.date} type='date' onChange={Inputarrival}></input>
         <span className={`iconfont icon-jumao ${style.select}`}></span>
        </div>
      </div>
       <div className={style.item}>
        <h5 className={style.title}>TA的状态</h5>
        <div  className={style.inputdetail} onClick={() => (setShowState(true))}>
          {staterOptions.find(item => item.value === form.state)?.label ?? ''}
        </div>
      </div>
       <div className={style.item}>
        <h5 className={style.title}>TA的毛色</h5>
        <div  className={style.inputdetail} onClick={() => (setShowcoat(true))} >
         {coatColorOptions.find(item => item.value === form.coat_color)?.label ?? ''}
        </div>
      </div>
       <div className={style.item}>
        <h5 className={style.title}>TA的常驻地点</h5>
        <input  className={style.inputdetail}></input>
      </div>
       <div className={style.things}>
        <h5 className={style.title}>宠物故事</h5>
        <textarea placeholder='讲讲他的事情吧' className={style.inputstory} onChange={Inputstory} value={form.story}></textarea>
      </div>
      <div className={style.item}>
      <button className={style.submit} onClick={addStep}>完&nbsp;&nbsp;成</button>
      </div>
    </div>
  )
}