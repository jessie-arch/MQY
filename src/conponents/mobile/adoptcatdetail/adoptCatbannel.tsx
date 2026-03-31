import style from './adoptCatbanel.module.css'
import star from '../../../assets/img/star.png'
import {useEffect, useRef, useState} from 'react'
import {FetchpreCatdetail, followCat, unfollowCat} from '../../../service/adoptCat'
import { useDispatch } from 'react-redux'
import { setError } from '../../../store/slSlice'
import {neuteredStatusOptios, staterOptions} from '../../shared/data'
import type {selectdatatype} from '../../shared/data'

type CatDetail = {
  story: string
  status: number | null
  name: string
  gender: number | null
  neutered_status: number | null
  is_following: boolean | null
  birth_date: string
  arrival_date: string
  avatar: string
}

export function AdoptCat ({catId}: {catId:number}) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [followDirty, setFollowDirty] = useState(false)
  const followDebounceRef = useRef<number | null>(null)
  const [detail, setDetail] = useState<CatDetail>({
    story:'',
    status:null,
    name:'',
    gender:null,
    neutered_status:null,
    is_following:null,
    birth_date:'',
    arrival_date:'',
    avatar:''
  })

  useEffect(() => {
    let mounted = true
    setLoading(true);
    (async () => {
      try {
        const res = await FetchpreCatdetail(catId)
        if (!mounted || !res?.data) return
        const userInfo = res.data.user_info ?? {}
        setDetail(pre => ({
          ...pre,
          story: res.data.story ?? '',
          status: res.data.status ?? null,
          name: res.data.name ?? '',
          gender: res.data.gender ?? null,
          neutered_status: res.data.neutered_status ?? null,
          is_following:
            typeof userInfo.is_following === 'boolean'
              ? userInfo.is_following
              : null,
          birth_date: res.data.birth_date ?? '',
          arrival_date: res.data.arrival_date ?? '',
          avatar: res.data.avatar ?? ''
        }))
      } catch (error) {
        dispatch(setError('加载失败了喵, 请刷新后再试吧'))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [catId])

  useEffect(() => {
    if (!followDirty || detail.is_following === null) return

    if (followDebounceRef.current) {
      window.clearTimeout(followDebounceRef.current)
    }

    followDebounceRef.current = window.setTimeout(async () => {
      try {
        if (detail.is_following) {
          await followCat(catId)
        } else {
          await unfollowCat(catId)
        }
      } catch (error) {
        dispatch(setError('更新关注状态失败，请稍后再试'))
        setDetail(pre => ({
          ...pre,
          is_following: !pre.is_following
        }))
      } finally {
        setFollowDirty(false)
      }
    }, 400)

    return () => {
      if (followDebounceRef.current) {
        window.clearTimeout(followDebounceRef.current)
      }
    }
  }, [catId, detail.is_following, followDirty, dispatch])

  const Handlefollow = () => {
    setFollowDirty(true)
    setDetail(pre => ({
      ...pre,
      is_following: !pre.is_following
    }))
  }

  const findLabel = (fieldName:selectdatatype[], value:number | null) => {
    if (value === null) return
    const item = fieldName.find(item => item.value === value)
    return item?.label
  }

  return(
    <div className={style.container} aria-busy={loading} aria-live="polite">
      {loading && (
        <div className={style.loadingOverlay}>
          <div className={style.loadingSpinner} aria-hidden="true"></div>
          <span className={style.loadingText}>个喵档案加载中...</span>
        </div>
      )}
      <div className={style.imgbannel}>
        <div className={style.imgcontains}>
      <img src={detail.avatar} className={style.catimg} alt='头像好像失踪了'></img>
        </div>
        <div className={style.starbox}>
          <img src={star} className={style.star}></img>
          <span className={style.state}>{findLabel?.(staterOptions, detail.status) || '未知'}</span>
        </div>
      </div>


      <div className={style.detailInfrom}>
        <div className={style.detailInformo}>
          <span className={style.title}>{detail.name}</span>
          <span  className={`iconfont ${detail.gender === 0 ? 'icon-nannv-nv' : 'icon-nannv-nan'} ${detail.gender === 0 ? style.girl : style.boy} ${style.catgender}`}></span>
          <button className={`${style.followbtn} ${detail.is_following ? style.followed : style.unfollow}`} onClick={Handlefollow}>{detail.is_following ? '已关注' :  '\u002B 关注'}</button>
        </div>
        <div className={style.detailInformt}>
          <div>{findLabel?.(neuteredStatusOptios, detail.neutered_status) || '未知'}</div>
          <div>{`出生日期: ${detail.birth_date}`}</div>
          <div>{`入园日期: ${detail.arrival_date}`}</div>
        </div>
        <div className={style.detailstory}>
          {detail.story}
        </div>
        <div className={style.adoptbtn}>
        {detail.status === 1?<span className={style.adoptbtner}>我要领养</span> : ''}
        </div>
      </div>


      <div className={style.post}>

      </div>
    </div>
  )
}