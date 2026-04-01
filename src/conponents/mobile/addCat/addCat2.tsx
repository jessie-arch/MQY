import logoCat from '../../assets/img/logo.svg'
import { useState } from 'react'
import { setError } from '../../../store/slSlice'
import { useDispatch } from 'react-redux'
import style from './addCat2.module.css'
import type { AddCatNameimgProps } from './addCat'
import type {catData} from '../../../service/addCatFetch'

export function Catgendertnr ({ form, setForm,  minusStep, addStep }: AddCatNameimgProps) {
  const dispatch = useDispatch();
  //提交
  const submit = () => {
    if(typeof form.gender !== 'number' || typeof form.neutered_status !== 'number'){
  dispatch(setError('请填写咪的性别和绝育状态哦~'))
  return;
}
    addStep();
  }
  const Select = (name: keyof catData, value: number) => {
    setForm({
      ...form,
      [name]: value
    })
  }
  return(
    <div>
       <div className={style.topbar}>
        <span className={`iconfont icon-jiantou-zuo ${style.step}`} onClick={minusStep}></span>
      </div>
      <div className={style.gender}>
        <h5 className={style.title}>TA的性别</h5>
        <ul className={style.stateul}>
          <li className={form.gender === 1 ? `${style.stateli} ${style.liSelect}` : style.stateli} onClick={() => Select('gender',1)}>弟&nbsp;&nbsp;&nbsp;&nbsp;弟</li>
          <li className={form.gender === 0 ? `${style.stateli} ${style.liSelect}` : style.stateli} onClick={() => Select('gender',0)}>妹&nbsp;&nbsp;&nbsp;&nbsp;妹</li>
        </ul>
      </div>
      <div className={style.tnrstate}>
         <h5 className={style.title}>绝育状态</h5>
        <ul className={style.stateul}>
          <li className={form.neutered_status === 1 ? `${style.stateli} ${style.liSelect}` : style.stateli} onClick={() => Select('neutered_status',1)}>已绝育</li>
          <li className={form.neutered_status === 2 ? `${style.stateli} ${style.liSelect}` : style.stateli} onClick={() => Select('neutered_status',2)}>未绝育</li>
          <li className={form.neutered_status === 0 ? `${style.stateli} ${style.liSelect}` : style.stateli} onClick={() => Select('neutered_status',0)}>未&nbsp;&nbsp;&nbsp;&nbsp;知</li>
        </ul>
      </div>
      <button className={style.submit} onClick={submit}>下&nbsp;一&nbsp;步</button>
    </div>
  )
}