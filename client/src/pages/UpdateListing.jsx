import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/createListing.css'

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='form-container'>
      <h1 className='form-title'>Update a Listing</h1>
      <form onSubmit={handleSubmit} className='form'>
        <div className='form-field'>
          <label className='form-label' htmlFor='name'>Name</label>
          <input
            type='text'
            placeholder='Name'
            className='form-input'
            id='name'
            maxLength='62'
            minLength='10'
            required
            onChange={handleChange}
            value={formData.name}
          />
        </div>
        <div className='form-field'>
          <label className='form-label' htmlFor='description'>Description</label>
          <textarea
            placeholder='Description'
            className='form-input'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
        </div>
        <div className='form-field'>
          <label className='form-label' htmlFor='address'>Address</label>
          <input
            type='text'
            placeholder='Address'
            className='form-input'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
        </div>
        <div className='checkbox-group'>
          <label className='checkbox-label'>
            <input
              type='checkbox'
              id='sale'
              className='checkbox-input'
              onChange={handleChange}
              checked={formData.type === 'sale'}
            />
            <span className='checkbox-text'>Sell</span>
          </label>
          <label className='checkbox-label'>
            <input
              type='checkbox'
              id='rent'
              className='checkbox-input'
              onChange={handleChange}
              checked={formData.type === 'rent'}
            />
            <span className='checkbox-text'>Rent</span>
          </label>
          <label className='checkbox-label'>
            <input
              type='checkbox'
              id='parking'
              className='checkbox-input'
              onChange={handleChange}
              checked={formData.parking}
            />
            <span className='checkbox-text'>Parking spot</span>
          </label>
          <label className='checkbox-label'>
            <input
              type='checkbox'
              id='furnished'
              className='checkbox-input'
              onChange={handleChange}
              checked={formData.furnished}
            />
            <span className='checkbox-text'>Furnished</span>
          </label>
          <label className='checkbox-label'>
            <input
              type='checkbox'
              id='offer'
              className='checkbox-input'
              onChange={handleChange}
              checked={formData.offer}
            />
            <span className='checkbox-text'>Offer</span>
          </label>
        </div>
        <div className='form-field'>
          <div className='input-group'>
            <input
              type='number'
              id='bedrooms'
              min='1'
              max='10'
              required
              className='input'
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <label className='label'>Beds</label>
          </div>
          <div className='input-group'>
            <input
              type='number'
              id='bathrooms'
              min='1'
              max='10'
              required
              className='input'
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <label className='label'>Baths</label>
          </div>
          <div className='input-group'>
            <input
              type='number'
              id='regularPrice'
              min='50'
              max='10000000'
              required
              className='input'
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <label className='label'>Regular price ($ / month)</label>
          </div>
          {formData.offer && (
            <div className='input-group'>
              <input
                type='number'
                id='discountPrice'
                min='0'
                max='10000000'
                required
                className='input'
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <label className='label'>Discounted price ($ / month)</label>
            </div>
          )}
        </div>
        <div className='form-field'>
          <label className='form-label' htmlFor='images'>Images:</label>
          <span className='form-info'>The first image will be the cover (max 6)</span>
          <div className='input-group'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='file-input'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='upload-button'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='error-message'>{imageUploadError && imageUploadError}</p>
        </div>
        {formData.imageUrls.length > 0 &&
          formData.imageUrls.map((url, index) => (
            <div key={url} className='image-container'>
              <img
                src={url}
                alt='listing image'
                className='listing-image'
              />
              <button
                type='button'
                onClick={() => handleRemoveImage(index)}
                className='delete-button'
              >
                Delete
              </button>
            </div>
          ))}
        <button
          disabled={loading || uploading}
          className='submit-button'
        >
          {loading ? 'Creating...' : 'Update listing'}
        </button>
        {error && <p className='error-message'>{error}</p>}
      </form>
    </main>
  );
}
