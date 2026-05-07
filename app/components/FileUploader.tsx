import {useDropzone} from 'react-dropzone'
import {useCallback,useState} from 'react'

interface FileUploaderProps {
  onFileSelect? (file: File | null) => void;
}

const FileUploader =({onFileSelect}: FileUploaderProps) => {
  const [file, setFile] = useState()

  const onDrop = useCallback((acceptedFiles : File[]) => {
    // Do something with the files
    const file = acceptedFiles[0] || null
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


  return (
    <div className="w-full gradient-border">
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="space-y-4 cursor-pointer">
        <div className="mx-auto w-16 h-16 flex items-center justify-center">
        <img src="/assets/icons/info.svg" alt="upload" className="size-20" />
        </div>
        {file ? (
          <div>

          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-500">
              <span className="font-semibold">
                Click to upload
              </span> or drap or drop
            </p>
            <p className="text-lg text-gray-500">PDF (max 20 MB)</p>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default FileUploader