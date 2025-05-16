'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/lib/store';
import { selectUser, selectAuthLoading, selectAuthError } from '@/app/features/auth/authSlice';
import { userAPI } from '@/app/lib/apiClient';
import { addNotification } from '@/app/features/ui/uiSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
});

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Reset preview when component mounts or when user changes
    if (user?.profilePicture) {
      setPreviewUrl(user.profilePicture);
    } else {
      setPreviewUrl(null);
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    
    const file = event.target.files ? event.target.files[0] : null;
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      setUploadError('Please select an image file');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('File size must be less than 2MB');
      return;
    }

    setSelectedFile(file);
    
    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Clean up the URL when component unmounts or when file changes
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsSubmitting(true);
      
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);
      
      await userAPI.uploadProfilePicture(formData);
      
      dispatch(addNotification({
        message: 'Profile picture updated successfully',
        type: 'success',
      }));
      
      // Refresh user data would happen here
      // dispatch(getCurrentUser());
      
    } catch (error: any) {
      setUploadError(error.response?.data?.message || 'Failed to upload profile picture');
      
      dispatch(addNotification({
        message: 'Failed to upload profile picture',
        type: 'error',
      }));
    } finally {
      setIsSubmitting(false);
      setSelectedFile(null);
    }
  };

  const handleDeletePicture = async () => {
    try {
      setIsSubmitting(true);
      
      await userAPI.deleteProfilePicture();
      
      setPreviewUrl(null);
      
      dispatch(addNotification({
        message: 'Profile picture deleted successfully',
        type: 'success',
      }));
      
      // Refresh user data would happen here
      // dispatch(getCurrentUser());
      
    } catch (error: any) {
      dispatch(addNotification({
        message: error.response?.data?.message || 'Failed to delete profile picture',
        type: 'error',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async (values: { firstName: string; lastName: string }) => {
    try {
      setIsSubmitting(true);
      
      await userAPI.updateProfile(values);
      
      dispatch(addNotification({
        message: 'Profile updated successfully',
        type: 'success',
      }));
      
      // Refresh user data would happen here
      // dispatch(getCurrentUser());
      
    } catch (error: any) {
      dispatch(addNotification({
        message: error.response?.data?.message || 'Failed to update profile',
        type: 'error',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Settings</h2>
      
      <div className="space-y-8">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Picture</h3>
          
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile Preview" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="mb-4">
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload New Picture
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100"
                />
                {uploadError && (
                  <p className="mt-1 text-sm text-red-600">{uploadError}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isSubmitting ? 'Uploading...' : 'Upload Picture'}
                  </button>
                )}
                
                {previewUrl && !selectedFile && (
                  <button
                    type="button"
                    onClick={handleDeletePicture}
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isSubmitting ? 'Deleting...' : 'Delete Picture'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h3>
          
          <Formik
            initialValues={{
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
            }}
            validationSchema={ProfileSchema}
            onSubmit={handleUpdateProfile}
            enableReinitialize
          >
            {({ errors, touched }) => (
              <Form>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      className={`block w-full px-3 py-2 border ${
                        errors.firstName && touched.firstName
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      } rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm`}
                    />
                    <ErrorMessage name="firstName" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      type="text"
                      className={`block w-full px-3 py-2 border ${
                        errors.lastName && touched.lastName
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                      } rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm`}
                    />
                    <ErrorMessage name="lastName" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        
        {/* Account Settings Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Account Settings</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Change Password</h4>
              <p className="text-sm text-gray-500 mt-1">
                Update your password to keep your account secure.
              </p>
              <button
                type="button"
                className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Change Password
              </button>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-800">Email Preferences</h4>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Receive newsletter and product updates
                  </span>
                </label>
              </div>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Receive email notifications about account activity
                  </span>
                </label>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-red-600">Danger Zone</h4>
              <p className="text-sm text-gray-500 mt-1">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                type="button"
                className="mt-2 inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}