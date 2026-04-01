import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { catService } from '../../service';
import type { GalleryCat } from '../../service';
import { AdoptFormModal } from './AdoptFormModal';

function AdoptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cat, setCat] = useState<GalleryCat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatDetail = async () => {
      if (!id) return;
      try {
        // 从图鉴中获取猫咪信息
        const res = await catService.getGallery();
        if (res.code === 200 && res.data) {
          const found = res.data.cats.find(c => c.cat_id === Number(id));
          setCat(found || null);
        }
      } catch (error) {
        console.error('加载猫咪信息失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatDetail();
  }, [id]);

  const handleClose = () => {
    navigate('/home');
  };

  if (loading) {
    return null;
  }

  return (
    <AdoptFormModal
      onClose={handleClose}
      catName={cat?.name || '猫咪'}
      catId={id}
    />
  );
}

export default AdoptDetail;