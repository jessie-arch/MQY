import style from './addCat.module.css'
import {staterOptions, coatColorOptions} from '../../shared/data'
import { useState, useRef } from 'react'
import type {catData, SubmitCaimg} from '../../../service/addCatFetch'
import {addCatFetch, FetchpreCatAvator, SubmitImage} from '../../../service/addCatFetch'
import { setError } from '../../../store/slSlice'
import { useDispatch } from 'react-redux'

export function AddCat () {
  const dispatch = useDispatch()
  const imgref = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [putmedia, setPutmedia] = useState<SubmitCaimg>({} as SubmitCaimg)
  const [form, setForm] = useState<catData>({
    name: '',
    gender: null,
    neutered_status: null,
    birth_data: '',
    arrival_date: '',
    state: null,
    coat_color: null,
    position: '',
    story: '',
    avatar_key: '',
  })

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    processFile(file)
  }

  const processFile = (file: File | null | undefined) => {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setPutmedia({
      ...putmedia,
      file: file,
    })
  }

  const handClick = () => {
    imgref.current?.click()
  }

  const Inputname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      name: e.target.value,
    })
  }

  const Inputbirth = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      birth_data: e.target.value
    })
  }

  const Inputarrival = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      arrival_date: e.target.value
    })
  }

  const Inputposition = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      position: e.target.value
    })
  }

  const Inputstory = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({
      ...form,
      story: e.target.value
    })
  }

  const Select = (name: keyof catData, value: number) => {
    setForm({
      ...form,
      [name]: value
    })
  }

  const handleSelectChange = (fieldName: keyof catData, e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value)
    setForm({
      ...form,
      [fieldName]: value
    })
  }

  const submitImg = async (): Promise<boolean> => {
    try {
      if (!putmedia.file) {
        dispatch(setError('请添加小猫头像哦~'))
        return false
      }

      setIsUploading(true)
      const res = await FetchpreCatAvator()
      console.log(res)
      setForm({
        ...form,
       avatar_key: res.data?.object_key
      })

      const uploadPayload: SubmitCaimg = {
        file: putmedia.file,
        upload_url: res.data?.upload_url
      }
      await SubmitImage(uploadPayload)

      return true
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : '上传失败'))
      return false
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.name?.trim()) {
      dispatch(setError('请完整输入小猫姓名哦~'))
      return
    }

    if (typeof form.gender !== 'number' || typeof form.neutered_status !== 'number') {
      dispatch(setError('请填写咪的性别和绝育状态哦~'))
      return
    }

    const isSuccess = await submitImg()
    if (!isSuccess) return

    await addCatFetch(form)
  }

  
  return(
    <div className={style.bannel}>
      <div className={style.nav}>
        <span className={style.navtitle}>个喵档案</span>
        <span className={`iconfont icon-cha ${style.out}`}></span>
      </div>
      <div>
        <div className={style.addImg}>
          <div
            className={preview ? style.imgContains : `iconfont icon-jiahao1 ${style.imgContains}`}
            onClick={handClick}
            onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {preview && <img src={preview} alt="预览" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />}
          </div>
          <input 
            type='file' 
            accept="image/jpeg" 
            className={style.imgInput}
            ref={imgref}
            onChange={handleFileInputChange}
          />
        </div>

        <div className={style.detailone}>
          <div className={style.part}>
            <span>姓名：</span>
            <input type='text' className={style.dot} value={form.name} onChange={Inputname}></input>
            <span>性别：</span>
            <ul className={style.dotlist}>
              <li className={form.gender === 0 ? `${style.dot} ${style.dotselected}` : style.dot} onClick={() => Select('gender', 0)}>妹妹</li>
              <li className={form.gender === 1 ? `${style.dot} ${style.dotselected}` : style.dot} onClick={() => Select('gender', 1)}>弟弟</li>
            </ul>
          </div>

          <div className={style.part}>
          <span className={style.title}>绝育状态：</span>
          <ul className={style.dotlist}>
            <li className={form.neutered_status === 1 ? `${style.dot} ${style.dotselected}` : style.dot} onClick={() => Select('neutered_status', 1)}>已绝育</li>
            <li className={form.neutered_status === 2 ? `${style.dot} ${style.dotselected}` : style.dot} onClick={() => Select('neutered_status', 2)}>未绝育</li>
            <li className={form.neutered_status === 0 ? `${style.dot} ${style.dotselected}` : style.dot} onClick={() => Select('neutered_status', 0)}>未知</li>
          </ul>
          </div>

          <div className={style.thirdpart}>
            <div>
               <span>TA的出生日期:</span>
              <div className={style.choose}>
                {form.birth_data && <span className={style.text}>{form.birth_data}</span>}
                <span className={`iconfont icon-a-xiajiantouxia ${style.choosebtn}`}></span>
              </div>
           <input type='date' className={style.inputdate} value={form.birth_data} onChange={Inputbirth}></input>
            </div>
           <div>
             <span>TA的入园日期:</span>
              <div className={style.chooser}>
                {form.arrival_date && <span className={style.text}>{form.arrival_date}</span>}
            <span className={`iconfont icon-a-xiajiantouxia ${style.choosebtnr}`}></span>
              </div>
           <input type='date' className={style.inputdater} value={form.arrival_date} onChange={Inputarrival}></input>
           </div>
          </div>

        <div className={style.detailtwo}>
         <div>
          <div className={style.section}>
          <span>常驻地点：</span>
          <input type='text' className={style.inputsection} value={form.position} onChange={Inputposition}></input>

          <span>TA的毛色:</span>
          <select value={form.coat_color ?? ''} onChange={(e) => handleSelectChange('coat_color', e)}>
            <option value="">请选择</option>
            {coatColorOptions.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>

           <span>TA的状态:</span>
          <select value={form.state ?? ''} onChange={(e) => handleSelectChange('state', e)}>
            <option value="">请选择</option>
            {staterOptions.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          </div>
        </div>
          </div>
            <div className={style.story}>
              <div>宠物故事：</div>
              <textarea className={style.storyare} value={form.story} onChange={Inputstory}></textarea>
            </div>
        
        </div>
        <button className={style.btn} onClick={handleSubmit} disabled={isUploading}>{isUploading ? '上传中...' : '发  送'}</button>
      </div>
    </div>
  )
}