// admin.js - API endpoints for ICRE College Admin Panel
const express = require('express');
const router = express.Router();

// Get all students with optional filtering
router.get('/student/', async (req, res) => {
    try {
        const db = req.app.locals.db;
        
        // Base query
        let query = `
            SELECT 
                application_id,
                first_name,
                last_name,
                email,
                phone,
                date_of_birth,
                gender,
                address,
                city,
                pincode,
                father_name,
                father_occupation,
                mother_name,
                mother_occupation,
                guardian_phone,
                guardian_email,
                annual_income,
                last_school,
                board_university,
                passing_year,
                percentage,
                course_applying,
                quota_category,
                status,
                submitted_at,
                updated_at
            FROM students 
            ORDER BY submitted_at DESC
        `;
        
        const [rows] = await db.execute(query);
        
        res.json({
            success: true,
            students1: rows,
            count: rows.length
        });
        
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student data',
            error: error.message
        });
    }
});

// Get single student by application ID
router.get('/student/:applicationId', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { applicationId } = req.params;
        
        const query = `
            SELECT 
                application_id,
                first_name,
                last_name,
                email,
                phone,
                date_of_birth,
                gender,
                address,
                city,
                pincode,
                father_name,
                father_occupation,
                mother_name,
                mother_occupation,
                guardian_phone,
                guardian_email,
                annual_income,
                last_school,
                board_university,
                passing_year,
                percentage,
                course_applying,
                quota_category,
                status,
                submitted_at,
                updated_at
            FROM students 
            WHERE application_id = ?
        `;
        
        const [rows] = await db.execute(query, [applicationId]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        res.json({
            success: true,
            student: rows[0]
        });
        
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student data',
            error: error.message
        });
    }
});

// Update student status (active/edit_locked)
router.put('/student/status/:applicationId', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { applicationId } = req.params;
        const { status } = req.body;
        
        // Validate status
        if (!status || !['active', 'edit_locked'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "active" or "edit_locked"'
            });
        }
        
        // Check if student exists
        const checkQuery = 'SELECT application_id FROM students WHERE application_id = ?';
        const [existing] = await db.execute(checkQuery, [applicationId]);
        
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        // Update status
        const updateQuery = `
            UPDATE students 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE application_id = ?
        `;
        
        const [result] = await db.execute(updateQuery, [status, applicationId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Failed to update student status'
            });
        }
        
        res.json({
            success: true,
            message: `Student status updated to ${status}`,
            applicationId: applicationId,
            newStatus: status
        });
        
    } catch (error) {
        console.error('Error updating student status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update student status',
            error: error.message
        });
    }
});

// Get dashboard statistics
router.get('/dashboard/stats', async (req, res) => {
    try {
        const db = req.app.locals.db;
        
        // Get total count
        const totalQuery = 'SELECT COUNT(*) as total FROM students';
        const [totalResult] = await db.execute(totalQuery);
        
        // Get active count
        const activeQuery = 'SELECT COUNT(*) as active FROM students WHERE status = "active"';
        const [activeResult] = await db.execute(activeQuery);
        
        // Get locked count
        const lockedQuery = 'SELECT COUNT(*) as locked FROM students WHERE status = "edit_locked"';
        const [lockedResult] = await db.execute(lockedQuery);
        
        // Get computer branch count
        const computerQuery = 'SELECT COUNT(*) as computer FROM students WHERE course_applying = "Computer"';
        const [computerResult] = await db.execute(computerQuery);
        
        // Get course-wise distribution
        const courseQuery = `
            SELECT course_applying, COUNT(*) as count 
            FROM students 
            GROUP BY course_applying 
            ORDER BY count DESC
        `;
        const [courseResult] = await db.execute(courseQuery);
        
        // Get recent applications (last 7 days)
        const recentQuery = `
            SELECT COUNT(*) as recent 
            FROM students 
            WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `;
        const [recentResult] = await db.execute(recentQuery);
        
        res.json({
            success: true,
            stats: {
                total: totalResult[0].total,
                active: activeResult[0].active,
                locked: lockedResult[0].locked,
                computer: computerResult[0].computer,
                recent: recentResult[0].recent,
                courseDistribution: courseResult
            }
        });
        
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});

// Search students (with filters)
router.get('/student/search/:term', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { term } = req.params;
        const { course, status } = req.query;
        
        let query = `
            SELECT 
                application_id,
                first_name,
                last_name,
                email,
                phone,
                course_applying,
                percentage,
                status,
                submitted_at
            FROM students 
            WHERE (
                first_name LIKE ? OR 
                last_name LIKE ? OR 
                email LIKE ? OR 
                phone LIKE ? OR 
                application_id LIKE ?
            )
        `;
        
        let queryParams = [
            `%${term}%`,
            `%${term}%`,
            `%${term}%`,
            `%${term}%`,
            `%${term}%`
        ];
        
        // Add course filter if provided
        if (course && course !== '') {
            query += ' AND course_applying = ?';
            queryParams.push(course);
        }
        
        // Add status filter if provided
        if (status && status !== '') {
            query += ' AND status = ?';
            queryParams.push(status);
        }
        
        query += ' ORDER BY submitted_at DESC LIMIT 50';
        
        const [rows] = await db.execute(query, queryParams);
        
        res.json({
            success: true,
            students: rows,
            count: rows.length,
            searchTerm: term
        });
        
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search students',
            error: error.message
        });
    }
});

// Get students by course
router.get('/student/course/:course', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { course } = req.params;
        
        const query = `
            SELECT 
                application_id,
                first_name,
                last_name,
                email,
                phone,
                percentage,
                status,
                submitted_at
            FROM students 
            WHERE course_applying = ?
            ORDER BY percentage DESC
        `;
        
        const [rows] = await db.execute(query, [course]);
        
        res.json({
            success: true,
            students: rows,
            course: course,
            count: rows.length
        });
        
    } catch (error) {
        console.error('Error fetching students by course:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students by course',
            error: error.message
        });
    }
});

// Get students by status
router.get('/student/status/:status', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { status } = req.params;
        
        // Validate status
        if (!['active', 'edit_locked'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "active" or "edit_locked"'
            });
        }
        
        const query = `
            SELECT 
                application_id,
                first_name,
                last_name,
                email,
                phone,
                course_applying,
                percentage,
                status,
                submitted_at
            FROM students 
            WHERE status = ?
            ORDER BY submitted_at DESC
        `;
        
        const [rows] = await db.execute(query, [status]);
        
        res.json({
            success: true,
            students: rows,
            status: status,
            count: rows.length
        });
        
    } catch (error) {
        console.error('Error fetching students by status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch students by status',
            error: error.message
        });
    }
});

// Bulk update status for multiple students
router.put('/student/bulk-status', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { applicationIds, status } = req.body;
        
        // Validate input
        if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Application IDs array is required'
            });
        }
        
        if (!status || !['active', 'edit_locked'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "active" or "edit_locked"'
            });
        }
        
        // Create placeholders for IN clause
        const placeholders = applicationIds.map(() => '?').join(',');
        const query = `
            UPDATE students 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE application_id IN (${placeholders})
        `;
        
        const queryParams = [status, ...applicationIds];
        const [result] = await db.execute(query, queryParams);
        
        res.json({
            success: true,
            message: `Updated status for ${result.affectedRows} students`,
            updatedCount: result.affectedRows,
            newStatus: status
        });
        
    } catch (error) {
        console.error('Error bulk updating student status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to bulk update student status',
            error: error.message
        });
    }
});

// Delete student (soft delete - mark as inactive)
router.delete('/student/:applicationId', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { applicationId } = req.params;
        
        // Check if student exists
        const checkQuery = 'SELECT application_id FROM students WHERE application_id = ?';
        const [existing] = await db.execute(checkQuery, [applicationId]);
        
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        // Instead of hard delete, you might want to add a 'deleted' status
        // For now, we'll do a hard delete as requested
        const deleteQuery = 'DELETE FROM students WHERE application_id = ?';
        const [result] = await db.execute(deleteQuery, [applicationId]);
        
        res.json({
            success: true,
            message: 'Student application deleted successfully',
            applicationId: applicationId
        });
        
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete student',
            error: error.message
        });
    }
});

// Export data to CSV format (returns JSON that can be converted to CSV)
router.get('/export/students', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { course, status } = req.query;
        
        let query = `
            SELECT 
                application_id as 'Application ID',
                CONCAT(first_name, ' ', last_name) as 'Full Name',
                email as 'Email',
                phone as 'Phone',
                course_applying as 'Course',
                percentage as 'Percentage',
                status as 'Status',
                DATE_FORMAT(submitted_at, '%Y-%m-%d %H:%i:%s') as 'Submitted At'
            FROM students
        `;
        
        let queryParams = [];
        let conditions = [];
        
        if (course && course !== '') {
            conditions.push('course_applying = ?');
            queryParams.push(course);
        }
        
        if (status && status !== '') {
            conditions.push('status = ?');
            queryParams.push(status);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY submitted_at DESC';
        
        const [rows] = await db.execute(query, queryParams);
        
        res.json({
            success: true,
            data: rows,
            count: rows.length,
            exportedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error exporting student data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export student data',
            error: error.message
        });
    }
});

module.exports = router;