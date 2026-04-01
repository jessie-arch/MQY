import { useParams, useNavigate } from "react-router-dom"

import { MobileAdoptFormModal } from './MobileAdoptFormModal';

function MobileAdoptDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/home');
    };

    return (
        <MobileAdoptFormModal
            onClose={handleClose}
            catId={id}
        />
    );
}

export default MobileAdoptDetail;