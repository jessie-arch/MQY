import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { request } from '../../../utils/myFetch';
import styles from './MobileAdoptFormModal.module.css';

interface MobileAdoptFormModalProps {
    onClose: () => void;
    catName?: string;
    catId?: string;
}

export const MobileAdoptFormModal: React.FC<MobileAdoptFormModalProps> = ({ onClose, catName, catId }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const catIdParam = catId || id;

    const [formData, setFormData] = useState({
        contact: '',
        reason: '',
        situation: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [catInfo, setCatInfo] = useState({
        name: catName || '月亮',
        avatar: '',
        gender: '',
        neutered: ''
    });

    // 获取猫咪信息
    useEffect(() => {
        const fetchCatDetail = async () => {
            if (!catIdParam) return;
            try {
                const res = await request<any>({
                    url: `/cat/detail/${catIdParam}`,
                    method: 'GET',
                    useToken: true
                });
                if (res.code === 200 && res.data) {
                    setCatInfo({
                        name: res.data.name,
                        avatar: res.data.avatar,
                        gender: res.data.gender === 1 ? '弟弟' : '妹妹',
                        neutered: res.data.neutered_status === 1 ? '已绝育' : '未绝育'
                    });
                }
            } catch (error) {
                console.error('获取猫咪信息失败:', error);
            }
        };
        fetchCatDetail();
    }, [catIdParam]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
            navigate('/home');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.contact.trim()) {
            alert('请填写联系方式');
            return;
        }
        if (!formData.reason.trim()) {
            alert('请填写领养原因');
            return;
        }

        setSubmitting(true);

        try {
            const res = await request<any>({
                url: '/cats',
                method: 'POST',
                data: {
                    name: catInfo.name,
                    gender: catInfo.gender === '弟弟' ? 1 : 0,
                    neutered_status: catInfo.neutered === '已绝育' ? 1 : 2,
                    birth_date: "2022-01-01",
                    arrival_date: "2023-01-01",
                    state: 1,
                    coat_color: 1,
                    position: "待领养",
                    story: `领养人：${formData.contact}，领养原因：${formData.reason}，家庭情况：${formData.situation || '无'}`,
                    avatar_key: ""
                },
                useToken: true
            });;

            if (res.code === 200) {
                alert('提交成功！我们会尽快联系您');
                onClose();
                navigate('/home');
            } else {
                alert(res.msg || '提交失败，请稍后重试');
            }
        } catch (error: any) {
            console.error('提交失败:', error);
            if (error.message?.includes('401')) {
                alert('请先登录');
                navigate('/');
            } else {
                alert('提交失败，请稍后重试');
            }
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                {/* 关闭按钮 */}
                <button className={styles.closeBtn} onClick={onClose}>
                    ×
                </button>

                {/* 标题 */}
                <h2 className={styles.title}>个喵领养</h2>

                {/* 猫咪信息 */}
                <div className={styles.catInfo}>
                    <div className={styles.catAvatar}>
                        {catInfo.avatar ? (
                            <img src={catInfo.avatar} alt={catInfo.name} />
                        ) : (
                            <div className={styles.catAvatarDefault}>🐱</div>
                        )}
                    </div>
                    <div className={styles.catDetails}>
                        <div className={styles.catName}>{catInfo.name}</div>
                        <div className={styles.catTags}>
                            <span className={styles.tag}>{catInfo.neutered}</span>
                            <span className={styles.tag}>{catInfo.gender}</span>
                        </div>
                    </div>
                </div>

                {/* 表单 */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* 联系方式 */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>联系方式：</label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            placeholder="请留下您的联系方式（微信号/手机号）"
                            className={styles.input}
                            required
                        />
                    </div>

                    {/* 领养原因 */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>领养原因是的原因是？</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="填写您想领养的原因"
                            className={styles.textarea}
                            rows={4}
                            required
                        />
                    </div>

                    {/* 家庭情况 */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>简单介绍一下家里的情况</label>
                        <textarea
                            name="situation"
                            value={formData.situation}
                            onChange={handleChange}
                            placeholder="居住及工作情况，是否有养猫的经验"
                            className={styles.textarea}
                            rows={3}
                        />
                    </div>

                    {/* 按钮组 */}
                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>
                            取消
                        </button>
                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? '提交中...' : '提交'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};