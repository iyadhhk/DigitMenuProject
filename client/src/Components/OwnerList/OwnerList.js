import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteOwner } from '../../features/adminSlice';

import './OwnerList.css';

const OwnerList = ({ owners }) => {
  const dispatch = useDispatch();
  const handleClick = (id) => {
    dispatch(deleteOwner({ id }));
  };
  return (
    <div className='ownerlist'>
      <h3>Liste des Clients</h3>
      {owners && owners.length > 0 ? (
        owners.map((owner) => (
          <div className='ownerlist__item' key={owner._id}>
            <h5>le Client :</h5>
            <span>{owner.username}</span>
            <button onClick={() => handleClick(owner._id)} className='owner__btn'>
              supprimer
            </button>
          </div>
        ))
      ) : (
        <h5>pas de clients</h5>
      )}
    </div>
  );
};

export default OwnerList;
