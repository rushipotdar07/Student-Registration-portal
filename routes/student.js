// const express = require('express');
// const router = express.Router();

// // Submit student registration form
// router.post('/register', async (req, res) => {
//     try {
//         const db = req.app.locals.db;
//         const formData = req.body;

//         // Basic validation
//         const requiredFields = [
//             'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
//             'gender', 'address', 'city', 'pincode', 'fatherName',
//             'motherName', 'guardianPhone', 'lastSchool', 'boardUniversity',
//             'passingYear', 'percentage', 'courseApplying'
//         ];

//         for (let field of requiredFields) {
//             if (!formData[field]) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `${field} is required`
//                 });
//             }
//         }

//         // Generate application ID
//         const applicationId = `APP${Date.now()}${Math.floor(Math.random() * 1000)}`;

//         // Insert into database
//         const insertQuery = `
//             INSERT INTO students (
//                 application_id, first_name, last_name, email, phone, date_of_birth,
//                 gender, address, city, pincode, father_name, mother_name,
//                 guardian_phone, last_school, board_university, passing_year,
//                 percentage, course_applying, status, submitted_at
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
//         `;

//         const values = [
//             applicationId,
//             formData.firstName,
//             formData.lastName,
//             formData.email,
//             formData.phone,
//             formData.dateOfBirth,
//             formData.gender,
//             formData.address,
//             formData.city,
//             formData.pincode,
//             formData.fatherName,
//             formData.motherName,
//             formData.guardianPhone,
//             formData.lastSchool,
//             formData.boardUniversity,
//             formData.passingYear,
//             formData.percentage,
//             formData.courseApplying
//         ];

//         const [result] = await db.execute(insertQuery, values);

//         console.log('New student application:', applicationId);

//         res.json({
//             success: true,
//             message: 'Application submitted successfully',
//             applicationId: applicationId,
//             studentId: result.insertId
//         });

//     } catch (error) {
//         console.error('Error submitting student form:', error);
        
//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email or phone already exists'
//             });
//         }
        
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });

// // Get student by application ID
// router.get('/:applicationId', async (req, res) => {
//     try {
//         const db = req.app.locals.db;
//         const { applicationId } = req.params;
        
//         const [rows] = await db.execute(
//             'SELECT * FROM students WHERE application_id = ?',
//             [applicationId]
//         );
        
//         if (rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Student not found'
//             });
//         }

//         res.json({
//             success: true,
//             student: rows[0]
//         });

//     } catch (error) {
//         console.error('Error fetching student:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });

// // Get all students (for admin)
// router.get('/', async (req, res) => {
//     try {
//         const db = req.app.locals.db;
        
//         const [rows] = await db.execute(
//             'SELECT * FROM students ORDER BY submitted_at DESC'
//         );

//         res.json({
//             success: true,
//             students: rows,
//             total: rows.length
//         });

//     } catch (error) {
//         console.error('Error fetching students:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });

// module.exports = router;


// this is final but commented for testing uploads crtificates

// const express = require('express');
// const router = express.Router();

// // Submit student registration form
// router.post('/register', async (req, res) => {
//     try {
//         const db = req.app.locals.db;
//         const formData = req.body;

//         // Basic validation for required fields
//         const requiredFields = [
//             'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
//             'gender', 'address', 'city', 'pincode', 'fatherName',
//             'motherName', 'guardianPhone', 'lastSchool', 'boardUniversity',
//             'passingYear', 'percentage', 'courseApplying'
//         ];

//         for (let field of requiredFields) {
//             if (!formData[field]) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `${field} is required`
//                 });
//             }
//         }

//         // Generate application ID
//         const applicationId = `APP${Date.now()}${Math.floor(Math.random() * 1000)}`;

//         // Insert into database with all available fields
//         const insertQuery = `
//             INSERT INTO students (
//                 user_id, application_id, first_name, last_name, date_of_birth,
//                 gender, email, phone, address, city, pincode, father_name,
//                 father_occupation, mother_name, mother_occupation, guardian_phone,
//                 guardian_email, annual_income, relationship, last_school,
//                 board_university, passing_year, percentage, stream, roll_number,
//                 course_applying, preferred_branch, achievements, extracurricular,
//                 competitive_exams, languages_known, skills, hobbies, status
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;

//         const values = [
//             null, // user_id - set to null (you'll need to make this field nullable first)
//             applicationId,
//             formData.firstName,
//             formData.lastName,
//             formData.dateOfBirth,
//             formData.gender,
//             formData.email,
//             formData.phone,
//             formData.address,
//             formData.city,
//             formData.pincode,
//             formData.fatherName,
//             formData.fatherOccupation || null,
//             formData.motherName,
//             formData.motherOccupation || null,
//             formData.guardianPhone,
//             formData.guardianEmail || null,
//             formData.annualIncome || null,
//             formData.relationship || null,
//             formData.lastSchool,
//             formData.boardUniversity,
//             formData.passingYear,
//             formData.percentage,
//             formData.stream || null,
//             formData.rollNumber || null,
//             formData.courseApplying,
//             formData.preferredBranch || null,
//             formData.achievements || null,
//             formData.extracurricular || null,
//             formData.competitiveExams || null,
//             formData.languagesKnown || null,
//             formData.skills || null,
//             formData.hobbies || null,
//             'pending'
//         ];

//         const [result] = await db.execute(insertQuery, values);

//         console.log('New student application:', applicationId);

//         res.json({
//             success: true,
//             message: 'Application submitted successfully',
//             applicationId: applicationId,
//             studentId: result.insertId
//         });

//     } catch (error) {
//         console.error('Error submitting student form:', error);
        
//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Application ID already exists or duplicate entry'
//             });
//         }
        
//         if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
//             return res.status(500).json({
//                 success: false,
//                 message: 'Database configuration error. Please contact administrator.'
//             });
//         }
        
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });

// // Get student by application ID
// router.get('/:applicationId', async (req, res) => {
//     try {
//         const db = req.app.locals.db;
//         const { applicationId } = req.params;
        
//         const [rows] = await db.execute(
//             'SELECT * FROM students WHERE application_id = ?',
//             [applicationId]
//         );
        
//         if (rows.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Student not found'
//             });
//         }

//         res.json({
//             success: true,
//             student: rows[0]
//         });

//     } catch (error) {
//         console.error('Error fetching student:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });

// // Get all students (for admin)
// router.get('/', async (req, res) => {
//     try {
//         const db = req.app.locals.db;
        
//         const [rows] = await db.execute(
//             'SELECT * FROM students ORDER BY submitted_at DESC'
//         );

//         res.json({
//             success: true,
//             students: rows,
//             total: rows.length
//         });

//     } catch (error) {
//         console.error('Error fetching students:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Internal server error'
//         });
//     }
// });

// module.exports = router;



// testing uploads certificates

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/certificates';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only PDF, JPG, JPEG, PNG files
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit per file
    }
});

// Submit student registration form
router.post('/register', upload.array('certificates', 10), async (req, res) => {
    try {
        const db = req.app.locals.db;
        const formData = req.body;
        const uploadedFiles = req.files || [];

        // Basic validation for required fields
        const requiredFields = [
            'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
            'gender', 'address', 'city', 'pincode', 'fatherName',
            'motherName', 'guardianPhone', 'lastSchool', 'boardUniversity',
            'passingYear', 'percentage', 'courseApplying'
        ];

        for (let field of requiredFields) {
            if (!formData[field]) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        // Generate application ID
        const applicationId = `ICRE${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Process uploaded certificates
        const certificateFiles = uploadedFiles.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype
        }));

        // Insert into database with updated fields (removed competitive_exams, languages_known, skills)
        const insertQuery = `
            INSERT INTO students1 (
                user_id, application_id, first_name, last_name, date_of_birth,
                gender, email, phone, address, city, pincode, father_name,
                father_occupation, mother_name, mother_occupation, guardian_phone,
                guardian_email, annual_income, relationship, last_school,
                board_university, passing_year, percentage, stream, roll_number,
                course_applying, preferred_branch, achievements, extracurricular,
                hobbies, certificates, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            null, // user_id - set to null for now
            applicationId,
            formData.firstName,
            formData.lastName,
            formData.dateOfBirth,
            formData.gender,
            formData.email,
            formData.phone,
            formData.address,
            formData.city,
            formData.pincode,
            formData.fatherName,
            formData.fatherOccupation || null,
            formData.motherName,
            formData.motherOccupation || null,
            formData.guardianPhone,
            formData.guardianEmail || null,
            formData.annualIncome || null,
            formData.relationship || null,
            formData.lastSchool,
            formData.boardUniversity,
            formData.passingYear,
            formData.percentage,
            formData.stream || null,
            formData.rollNumber || null,
            formData.courseApplying,
            formData.preferredBranch || null,
            formData.achievements || null,
            formData.extracurricular || null,
            formData.hobbies || null,
            JSON.stringify(certificateFiles), // Store certificate info as JSON
            'pending'
        ];

        const [result] = await db.execute(insertQuery, values);

        console.log('New student application:', applicationId);
        console.log('Uploaded certificates:', certificateFiles.length);

        res.json({
            success: true,
            message: 'Application submitted successfully',
            applicationId: applicationId,
            studentId: result.insertId,
            uploadedFiles: certificateFiles.length
        });

    } catch (error) {
        console.error('Error submitting student form:', error);
        
        // Clean up uploaded files if database insertion fails
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Application ID already exists or duplicate entry'
            });
        }
        
        if (error.code === 'ER_NO_DEFAULT_FOR_FIELD') {
            return res.status(500).json({
                success: false,
                message: 'Database configuration error. Please contact administrator.'
            });
        }

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum 5MB per file allowed.'
            });
        }

        if (error.message.includes('Invalid file type')) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get student by application ID
router.get('/:applicationId', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { applicationId } = req.params;
        
        const [rows] = await db.execute(
            'SELECT * FROM students1 WHERE application_id = ?',
            [applicationId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Parse certificates JSON if it exists
        const student = rows[0];
        if (student.certificates) {
            try {
                student.certificates = JSON.parse(student.certificates);
            } catch (e) {
                student.certificates = [];
            }
        }

        res.json({
            success: true,
            student: student
        });

    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get all students (for admin)
router.get('/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        
        const [rows] = await db.execute(
            'SELECT * FROM students1 ORDER BY submitted_at DESC'
        );

        // Parse certificates JSON for each student
        const students1 = rows.map(student => {
            if (student.certificates) {
                try {
                    student.certificates = JSON.parse(student.certificates);
                } catch (e) {
                    student.certificates = [];
                }
            }
            return student;
        });

        res.json({
            success: true,
            students1: students1,
            total: students1.length
        });

    } catch (error) {
        console.error('Error fetching students1:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Download certificate file
router.get('/certificate/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads/certificates', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.download(filePath);
    } catch (error) {
        console.error('Error downloading certificate:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading file'
        });
    }
});


// Admin login endpoint
router.post('/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Default admin credentials
        const defaultAdmin = {
            username: '@Icreadmin',
            password: 'icre@9156'
        };
        
        if (username === defaultAdmin.username && password === defaultAdmin.password) {
            // Generate admin token (optional)
            const token = 'admin_' + Date.now();
            
            res.json({
                success: true,
                message: 'Admin login successful',
                token: token,
                user: {
                    username: username,
                    role: 'admin'
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

module.exports = router;