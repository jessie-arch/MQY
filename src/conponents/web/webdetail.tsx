//整个文件均由章思雨完成
import { Link, useParams } from "react-router-dom"
import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { postService, type PostDetailItem } from "../../service/postService"

function Detail() {
  const { id } = useParams();
  const [detail, setDetail] = useState<PostDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    // 获取详情数据
    const loadDetail = async () => {
      try {
        if (!id) {
          setLoading(false);
          return;
        }

        const res = await postService.getPostDetail(id);
        if (res.code === 200 && res.data) {
          setDetail(res.data);
        }
      } catch (error) {
        console.error('加载详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]);

  const authorName = detail?.author?.username || '未知用户';
  const authorAvatar = detail?.author?.avatar_url || '';
  const likeCount = detail?.stats?.like_count ?? 0;
  const isLiked = Boolean(detail?.stats?.is_liked);

  const handleLike = async () => {
    if (!detail || liking) return;

    const previousStats = detail.stats;
    const nextIsLiked = !Boolean(previousStats?.is_liked);
    setLiking(true);
    setDetail(prev => (
      prev
        ? {
            ...prev,
            stats: {
              is_liked: nextIsLiked,
              like_count: nextIsLiked
                ? (prev.stats?.like_count ?? 0) + 1
                : Math.max((prev.stats?.like_count ?? 0) - 1, 0),
            },
          }
        : prev
    ));

    try {
      const res = previousStats?.is_liked 
        ? await postService.unlikePost(detail.post_id)
        : await postService.likePost(detail.post_id);
      if (res.code !== 200) {
        throw new Error(res.msg || '操作失败');
      }
    } catch (error) {
      console.error('点赞失败:', error);
      setDetail(prev => (
        prev
          ? {
              ...prev,
              stats: previousStats,
            }
          : prev
      ));
    } finally {
      setLiking(false);
    }
  };

  const detailView = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.1)',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: 'min(920px, 92vw)',
          minHeight: '320px',
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
          padding: '24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        <h1 style={{ margin: 0, textAlign: 'center' }}>动态详情页{id}</h1>
        {loading ? (
          <p style={{ margin: 0, textAlign: 'center' }}>加载中...</p>
        ) : detail ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px', alignItems: 'stretch', minHeight: '0' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#f5f5f5', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {detail.medias && detail.medias.length > 0 ? (
                detail.medias[0].media_type === 'VIDEO' ? (
                  <video
                    src={detail.medias[0].url || detail.medias[0].thumbnail_url}
                    controls
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={detail.medias[0].url || detail.medias[0].thumbnail_url}
                    alt={detail.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )
              ) : (
                <span style={{ color: '#999' }}>暂无图片</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '0', overflow: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', background: '#e4e4e4', flexShrink: 0 }}>
                  {authorAvatar ? (
                    <img src={authorAvatar} alt={authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{authorName.charAt(0) || '?'}</div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: 600 }}>{authorName}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>{detail.create_time}</div>
                </div>
              </div>

              <div style={{ fontSize: '16px', fontWeight: 600 }}>{detail.title}</div>
              <div style={{ color: '#666', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{detail.content}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
                <span
                  onClick={handleLike}
                  style={{ color: isLiked ? '#ff4d4d' : '#666', cursor: liking ? 'wait' : 'pointer', userSelect: 'none' }}
                >
                  ♥ {likeCount}
                </span>
                <span style={{ color: '#666' }}>{detail.cat?.name}</span>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, textAlign: 'center' }}>加载失败</p>
        )}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/home">返回主页</Link>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') {
    return detailView;
  }

  return createPortal(detailView, document.body);
}

export default Detail;