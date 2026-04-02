//整个文件均由贺艳完成
import logoCat from '../../../assets/img/logo.svg'
import type { SubmitCaimg } from '../../../service/addCatFetch'
import style from './addCat1.module.css'
import { useRef, useState } from 'react'
import { setError } from '../../../store/slSlice'
import { useDispatch } from 'react-redux'
import {FetchpreCatAvator,SubmitImage } from '../../../service/addCatFetch'
import type { AddCatNameimgProps } from './addCat'

export function AddCatNameimg({ form, setForm,  minusStep, addStep }: AddCatNameimgProps) {
  const dispatch = useDispatch()
  const [preview, setPreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const[putmedia,setPutmedia] = useState<SubmitCaimg>({} as SubmitCaimg);

  //处理提交之后的步骤
  const nextStep = async () => {
    if (isUploading) return

    if (!form.name?.trim() ) {
      dispatch(setError('请完整输入小猫姓名哦~'))
      return
    }

    const isSuccess = await submitImg()
    if (!isSuccess) return

    addStep();
  }
 //输入名字
  const Inputname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      name: e.target.value,
    })
  }
  //图片部分
  const imgref = useRef<HTMLInputElement>(null)
  const handClick = () => {
    imgref.current?.click()
  }
//查看是否有文件交到input
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }
//处理文件拖动
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    processFile(file)
  }
//将文件存入状态
  const processFile = (file: File | null | undefined) => {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setPutmedia({
      ...putmedia,
      file: file,
    })
  }

  //上传图片
 const submitImg = async(): Promise<boolean> => {
  try {
    if(!putmedia.file) {
      dispatch(setError('请添加小猫头像哦~'))
      return false
    }

    setIsUploading(true)
    const res = await FetchpreCatAvator()
    setForm({
      ...form,
      avatar_key: res.data.object_key
    })

    const uploadPayload: SubmitCaimg = {
      file: putmedia.file,
      upload_url: res.data.upload_url
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
  
  return (
    <div>
      <div className={style.topbar}>
        <span className={`iconfont icon-jiantou-zuo ${style.step}`} onClick={minusStep}></span>
      </div>

      <div className={style.name}>
        <h5 className={style.nametitle}>TA的名字</h5>
        <input type="text" className={style.nameInput} value={form.name} onChange={Inputname} />
      </div>

      <div className={style.img}>
        <h5 className={style.imgTitle}>TA的照片</h5>
        <div className={style.imgcontent}>
          {!preview ? (
            <div
              className={style.addImgcontent}
              onClick={handClick}
              onDrop={handleDrop}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
            >
              <span className={`iconfont icon-jiahao1 ${style.add}`}></span>
            </div>
          ) : (
            <img src={preview} alt="预览" className={style.img} />
          )}
        </div>

        <input
          type="file"
          accept="image/jpeg"
          className={style.inputImg}
          ref={imgref}
          onChange={handleFileInputChange}
        />
      </div>

      <button className={style.nextStep} onClick={nextStep} disabled={isUploading}>
        {isUploading ? (
          <span className={style.uploadingText}>
            上传中
            <span className={style.dotOne}>.</span>
            <span className={style.dotTwo}>.</span>
            <span className={style.dotThree}>.</span>
          </span>
        ) : '下一步'}
      </button>
      <img src={logoCat} className={style.logo} />
    </div>
  )
}