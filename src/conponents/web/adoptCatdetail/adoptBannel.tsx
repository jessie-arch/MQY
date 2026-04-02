//整个文件均由贺艳完成
import style from './adoptBannel.module.css'
import star from '../../../assets/img/star.png'
import {useState,useEffect,useRef} from 'react'
import {FetchpreCatdetail,followCat,unfollowCat} from '../../../service/adoptCat'
import { useDispatch } from 'react-redux'
import { setError } from '../../../store/slSlice'
import {staterOptions,neuteredStatusOptios} from '../../shared/data'
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
  avatar:string
}
export function Adoptbannel ({
  CatId,
  onClose,
  onAdopt,
}: {
  CatId: number;
  onClose?: () => void;
  onAdopt?: (catId: number, catName?: string, catAvatar?: string) => void;
}) {
  const dispatch = useDispatch();
  const [followflag,setFollowflag] = useState<boolean>(false);
  const [detail,setDetail] = useState<CatDetail>({
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
  const [loading,setLoading] = useState(true)
  const followDebounceRef = useRef<number | null>(null)
  //获取数据
  useEffect(() => {
    let mounted = true
    setLoading(true)
    ;(async () => {
      try {
        const res = await FetchpreCatdetail(CatId)
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
          avatar:res.data.avatar
        }))
      } catch (error) {
       dispatch(setError(`因为${error}加载失败了喵, 请刷新后再试吧`))
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  },[CatId])
  
  //处理关注
  const Handlefollow = () => {
    setFollowflag(true)
    setDetail(pre => ({
        ...pre,
        is_following:!(pre.is_following)
    }))
  }
  useEffect(() => {
    if (!followflag || detail.is_following === null) return

    if (followDebounceRef.current) {
      window.clearTimeout(followDebounceRef.current)
    }

    followDebounceRef.current = window.setTimeout(async () => {
      try {
        if (detail.is_following) {
          await followCat(CatId)
        } else {
          await unfollowCat(CatId)
        }
      } catch (error) {
        dispatch(setError(`失败，${error}`))
        setDetail(pre => ({
          ...pre,
          is_following: !pre.is_following
        }))
      } finally {
        setFollowflag(false)
      }
    }, 400)

    return () => {
      if (followDebounceRef.current) {
        window.clearTimeout(followDebounceRef.current)
      }
    }
  },[CatId, detail.is_following, followflag, dispatch])

  //数据处理
  const fingLabel = (filedname:selectdatatype[],value:number | null) => {
    if(!value) return;
    const item = filedname.find(item => item.value === value);
    return item?.label;
  }
  return(
    <div className={style.bannel} aria-busy={loading} aria-live="polite">
      {loading && (
        <div className={style.loadingOverlay}>
          <div className={style.loadingSpinner} aria-hidden="true"></div>
          <span className={style.loadingText}>喵咪档案加载中...</span>
        </div>
      )}
    
      <div className={style.imgcontains}>
        <div className={`iconfont icon-cha ${style.out}`} onClick={onClose}></div>
        <div className={style.starFlag}>
          <img src={star} className={style.starimg}/>
         <span className={style.stateInform}>{fingLabel?.(staterOptions, detail.status) || '未知'}</span>
        </div>
      <div className={style.catImg}>
      <img src={detail.avatar} className={style.Imgcat} alt='头像好像失踪了'></img>
      </div>
      </div>

      <div className={style.detailcontains}>


      <div className={style.titlecontains}>
      <span className={style.name} >{detail.name}</span>
      <span
  className={`iconfont ${detail.gender === 0 ? 'icon-nannv-nv'  : 'icon-nannv-nan'} ${detail.gender === 0 ? style.girl  : style.boy} ${style.catgender}`}
></span>
        <button className={`${detail.is_following? style.followed:style.unfollow} ${style.follow}`} onClick={Handlefollow}>{detail.is_following ? '已关注' : '\u002B 关注'}</button>
    </div>

    <div className={style.datecontains}>
      <div>{fingLabel?.(neuteredStatusOptios, detail.neutered_status) || '未知'}</div>
      <div>{`出生日期:${detail.birth_date}`}</div>
      <div>{`入园时间:${detail.arrival_date}`}</div>
    </div>

    <div className={style.storycontains}>
      {detail.story}
    </div>

    <div className={style.btncontains}>
      {detail.status === 1 ? (
        <span className={style.adoptbtn} onClick={() => onAdopt?.(CatId, detail.name, detail.avatar)}>我要领养</span>
      ) : ''}
    </div>
      </div>
    </div>
  )
}
