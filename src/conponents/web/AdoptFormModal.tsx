import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { catService } from '../../service';
import styles from './AdoptFormModal.module.css';

interface AdoptFormModalProps {
    onClose: () => void;
    catName?: string;
    catId?: string;
}

export const AdoptFormModal: React.FC<AdoptFormModalProps> = ({ onClose, catName, catId }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const catIdParam = catId || id;

    const [formData, setFormData] = useState({
        contact: '',
        reason: '',
        situation: ''
    });
    const [submitting, setSubmitting] = useState(false);

    //猫咪信息（可以从接口获取，这里先用 mock）
    // const catInfo = {
    //     name: catName || '月亮',
    //     avatar: 'https://picsum.photos/200/200?random=1',
    //     gender: '妹妹',
    //     age: '2岁',
    //     neutered: '已绝育',
    //     vaccinated: '已接种疫苗',
    //     character: '温顺亲人，喜欢玩耍'
    // };
    const [catInfo, setCatInfo] = useState({  // ✅ 改为 state
        name: catName || '加载中...',
        avatar: '',
        gender: '',
        age: '',
        neutered: '',
        vaccinated: '',
        character: ''
    });
    // ✅ 获取猫咪信息
    useEffect(() => {
        const fetchCatDetail = async () => {
            if (!catIdParam) return;
            try {
                const res = await catService.getCatDetail(catIdParam);
                if (res.code === 200 && res.data) {
                    setCatInfo({
                        name: res.data.name,
                        avatar: res.data.avatar,
                        gender: res.data.gender === 1 ? '弟弟' : '妹妹',
                        // age: res.data.birth_date ? `${new Date().getFullYear() - new Date(res.data.birth_date).getFullYear()}岁` : '未知',
                        // neutered: res.data.neutered_status === 1 ? '已绝育' : '未绝育',
                        // vaccinated: '已接种疫苗',
                        // character: res.data.story || '温顺亲人'
                        age: '未知',  // 暂不计算年龄
                        neutered: '未绝育',  // 默认值
                        vaccinated: '已接种疫苗',
                        character: '温顺亲人'
                    });
                }
            } catch (error) {
                console.error('获取猫咪信息失败:', error);
                // 降级使用 mock 数据
                setCatInfo({
                    name: catName || '月亮',
                    avatar: 'https://picsum.photos/200/200?random=1',
                    gender: '妹妹',
                    age: '2岁',
                    neutered: '已绝育',
                    vaccinated: '已接种疫苗',
                    character: '温顺亲人，喜欢玩耍'
                });
            }
        };
        fetchCatDetail();
    }, [catIdParam, catName]);
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
            // 调用领养接口
            const res = await catService.submitAdopt({
                cat_id: Number(catIdParam),
                contact_info: formData.contact,
                reason: formData.reason,
                info: formData.situation || undefined
            });

            if (res.code === 200) {
                alert('提交成功！我们会尽快联系您');
                onClose();
                navigate('/home');
            } else {
                alert(res.msg || '提交失败，请稍后重试');
            }
        } catch (error: any) {
            console.error('提交失败:', error);
            if (error.message?.includes('401') || error.message?.includes('未登录')) {
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

                <h2 className={styles.title}>个喵领养</h2>
                {/* 关闭按钮 */}
                <button className={styles.closeBtn} onClick={onClose}>
                    ×
                </button>

                {/* 左右布局内容 */}
                <div className={styles.content}>
                    {/* 左侧：信息填写 */}
                    <div className={styles.formSection}>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {/* 联系方式 */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    联系方式：
                                </label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="您的联系方式(微信号/手机号)"
                                    className={styles.input}
                                    required
                                />
                            </div>

                            {/* 领养原因 */}
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    领养原因是的原因是？
                                </label>
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
                                <label className={styles.label}>
                                    简单介绍一下家里的情况
                                </label>
                                <textarea
                                    name="situation"
                                    value={formData.situation}
                                    onChange={handleChange}
                                    placeholder="居住及工作情况，是否有养猫的经验"
                                    className={styles.textarea}
                                    rows={3}
                                />
                            </div>


                        </form>
                    </div>

                    {/* 右侧：猫咪信息 */}
                    <div className={styles.catSection}>
                        <div className={styles.catCard}>
                            {/* 猫咪头像 */}
                            <div className={styles.catAvatar}>
                                {catInfo.avatar ? (
                                    <img
                                        src={catInfo.avatar}
                                        alt={catInfo.name}
                                        className={styles.catAvatarImg}
                                    />
                                ) : (
                                    <div className={styles.catAvatarDefault}>🐱</div>
                                )}
                            </div>

                            {/* 猫咪名字 */}
                            <div className={styles.catName}>{catInfo.name}</div>

                            {/* 猫咪标签 */}
                            <div className={styles.catTags}>
                                <span className={styles.tag}>{catInfo.neutered}</span>
                                <span className={styles.tag}>{catInfo.gender}</span>
                                <span className={styles.tag}>{catInfo.age}</span>
                            </div>


                        </div>
                    </div>
                </div>
                {/* 按钮组 */}
                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={submitting}
                    >
                        {submitting ? '提交中...' : '提交'}
                    </button>
                </div>
            </div>
        </div>
    );
};