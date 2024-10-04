// import { Request, Response } from 'express';
// import multer from 'multer';
// import path from 'path';
// import User from '../models/user/user.model';
// import Payment from '../models/user/payment.model';  // Ensure correct import path
// import Transaction from '../models/user/transaction.model'; // Ensure correct import path

// // Set up multer for file storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Specify the destination folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the original file name
//     }
// });

// const upload = multer({ storage });

// // Upload file controller
// const uploadFile = async (req: Request, res: Response) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded.' });
//     }

//     const { id, type } = req.body; // Assuming userId and type are sent in the body

//     // Validate userId and type
//     if (!id || !type) {
//         return res.status(400).json({ message: 'User ID and type are required.' });
//     }

//     try {
//         // Prepare the updated file details
//         const updatedFile = {
//             filename: req.file.originalname,
//             filepath: req.file.path,
//             mimetype: req.file.mimetype,
//         };

//         if (type === 'user') {
//             // Find the existing User record and update it
//             const user = await User.findByPk(id);
//             if (user) {
//                 user.filename = updatedFile.filename; // Update filename
//                 user.filepath = updatedFile.filepath; // Update filepath
//                 user.mimetype = updatedFile.mimetype; // Update mimetype
//                 await user.save(); // Save the updated user
//                 return res.status(200).json({
//                     message: 'User file updated successfully.',
//                     file: user,
//                 });
//             } else {
//                 return res.status(404).json({ message: 'User record not found.' });
//             }
//         } else if (type === 'payment') {
//             // Find the existing Payment record and update it
//             const payment = await Payment.findByPk(id);
//             if (payment) {
//                 payment.filename = updatedFile.filename; // Update filename
//                 payment.filepath = updatedFile.filepath; // Update filepath
//                 payment.mimetype = updatedFile.mimetype; // Update mimetype
//                 await payment.save(); // Save the updated payment
//                 return res.status(200).json({
//                     message: 'Payment file updated successfully.',
//                     file: payment,
//                 });
//             } else {
//                 return res.status(404).json({ message: 'Payment record not found.' });
//             }
//         } else if (type === 'transaction') {
//             // Find the existing Transaction record and update it
//             const transaction = await Transaction.findByPk(id);
//             if (transaction) {
//                 transaction.filename = updatedFile.filename; // Update filename
//                 transaction.filepath = updatedFile.filepath; // Update filepath
//                 transaction.mimetype = updatedFile.mimetype; // Update mimetype
//                 await transaction.save(); // Save the updated transaction
//                 return res.status(200).json({
//                     message: 'Transaction file updated successfully.',
//                     file: transaction,
//                 });
//             } else {
//                 return res.status(404).json({ message: 'Transaction record not found.' });
//             }
//         } else {
//             return res.status(400).json({ message: 'Invalid type provided.' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating file details in the database.', error });
//     }
// };

// export { upload, uploadFile };


import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import User from '../models/user/user.model';
import Payment from '../models/user/payment.model';
import Transaction from '../models/user/transaction.model';

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the original file name
    }
});

const upload = multer({ storage }).single('file'); // Ensure you specify 'file' as the field name

// Upload file controller
const uploadFile = async (req: Request, res: Response) => {
    // Check for uploaded file
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { id, type } = req.body; // Get userId and type from the request body

    // Validate userId and type
    if (!id || !type) {
        return res.status(400).json({ message: 'User ID and type are required.' });
    }

    try {
        // Prepare updated file details
        const updatedFileDetails = {
            filename: req.file.originalname,
            filepath: req.file.path,
            mimetype: req.file.mimetype,
        };

        let record;

        // Find and update the record based on type
        switch (type) {
            case 'user':
                record = await User.findByPk(id);
                if (!record) return res.status(404).json({ message: 'User record not found.' });
                break;
            case 'payment':
                record = await Payment.findByPk(id);
                if (!record) return res.status(404).json({ message: 'Payment record not found.' });
                break;
            case 'transaction':
                record = await Transaction.findByPk(id);
                if (!record) return res.status(404).json({ message: 'Transaction record not found.' });
                break;
            default:
                return res.status(400).json({ message: 'Invalid type provided.' });
        }

        // Update record details
        Object.assign(record, updatedFileDetails);
        await record.save();

        return res.status(200).json({
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} file updated successfully.`,
            file: record,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error updating file details in the database.', error });
    }
};

// Export the upload middleware and the upload file controller
export { upload, uploadFile };
