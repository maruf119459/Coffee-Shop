import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadSharp } from "react-icons/io5";

const DailyReportFileUpload = () => {
    const [files, setFiles] = useState([]);
    const [isFileAccepted, setIsFileAccepted] = useState(false);

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: {
            'application/pdf': ['.pdf']
        },
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles);
            setIsFileAccepted(true); // Set file accepted to true when a file is successfully dropped
        }
    });

    const acceptedFileItems = files.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission and access files
        console.log('Submitted files:', files);
        // Here you can send the files to your server or perform other actions
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className='w-[500px] flex flex-col items-center justify-center gap-y-4'>
                <section className="container ">
                    <div className='bg-sky-300 w-[500px] rounded-md p-4'>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <p className='font-semibold text-[25px] text-center'>Drag and drop Daily Report file here, or click to select files</p>
                            <div><IoCloudUploadSharp className='text-[50px] my-3 mx-auto' /></div>
                            {!isFileAccepted && <em>(1 file is the maximum number of files. You must upload a PDF file.)</em>}
                        </div>
                        <div>
                            <aside>
                                {isFileAccepted && <h4>Accepted files:</h4>}
                                <ul>{acceptedFileItems}</ul>
                            </aside>
                            {isFileAccepted && <p>File accepted successfully!</p>}
                        </div>
                    </div>

                </section>
                <button type="submit" className={isFileAccepted? "btn btn-success mx-auto": "btn btn-disabled  mx-auto"}>Upload File</button>
            </form>
        </div>
    );
}

export default DailyReportFileUpload;
