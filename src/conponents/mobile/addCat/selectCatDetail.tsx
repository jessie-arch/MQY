import type {selectdatatype} from '../../shared/data'
import { useEffect, useMemo, useRef, useState } from 'react'
import style from './selectCatDetail.module.css'
import type {catData} from '../../../service/addCatFetch'

const ITEM_HEIGHT = 44
const VISIBLE_COUNT = 5

type SelectProps = {
  datadetail: selectdatatype[]
  initialValue?: number,
  setForm:React.Dispatch<React.SetStateAction<catData>>,
  setShow:React.Dispatch<React.SetStateAction<boolean>>,
  filedName: keyof catData
}

export function Select ({ datadetail, initialValue,setShow,setForm: _setForm,filedName }: SelectProps) {
  const listRef = useRef<HTMLUListElement | null>(null)
  const frameRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const paddingCount = Math.floor(VISIBLE_COUNT / 2)
  const [isClosing, setIsClosing] = useState(false)

  const initialIndex = useMemo(() => {
    if (!datadetail.length) return 0

    if (initialValue === undefined) {
      return Math.floor(datadetail.length / 2)
    }

    const index = datadetail.findIndex((item) => item.value === initialValue)
    return index >= 0 ? index : Math.floor(datadetail.length / 2)
  }, [datadetail, initialValue])

  const [activeIndex, setActiveIndex] = useState(initialIndex)

  useEffect(() => {
    setActiveIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    const list = listRef.current
    if (!list || !datadetail.length) return

    list.scrollTop = initialIndex * ITEM_HEIGHT
  }, [datadetail.length, initialIndex])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const handleClose = () => {
    if (isClosing) return

    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(() => {
      setShow(false)
    }, 220)
  }

  const handleScroll = () => {
    const list = listRef.current
    if (!list || !datadetail.length) return

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
    }

    frameRef.current = requestAnimationFrame(() => {
      const rawIndex = Math.round(list.scrollTop / ITEM_HEIGHT)
      const nextIndex = Math.max(0, Math.min(datadetail.length - 1, rawIndex))
      setActiveIndex(nextIndex)
      frameRef.current = null
    })
  }
  const submit = () => {
  const selected = datadetail[activeIndex]
  if (!selected) return

  _setForm((prev) => ({
    ...prev,
    [filedName]: selected.value as catData[typeof filedName],
  }))
  handleClose();
}
  return(
    <div className={`${style.overlay} ${isClosing ? style.overlayClosing : ''}`}>
      <div className={`${style.selectbanel} ${isClosing ? style.selectbanelClosing : ''}`}>
        <div className={style.toolbar}>
          <button type='button' className={style.closeBtn} onClick={handleClose} >关闭</button>
          <button type='button' className={style.sendBtn} onClick={submit}>发送</button>
        </div>
        <div className={style.centerIndicator}></div>
        <ul className={style.container} ref={listRef} onScroll={handleScroll}>
          <li
            className={style.spacer}
            style={{ height: `${paddingCount * ITEM_HEIGHT}px` }}
            aria-hidden='true'
          ></li>
          {datadetail.map((item, index) => (
            <li
              key={`${item.value}-${index}`}
              className={index === activeIndex ? style.activeItem : style.item}
            >
              {item.label}
            </li>
          ))}
          <li
            className={style.spacer}
            style={{ height: `${paddingCount * ITEM_HEIGHT}px` }}
            aria-hidden='true'
          ></li>
        </ul>
      </div>
    </div>
  )
}