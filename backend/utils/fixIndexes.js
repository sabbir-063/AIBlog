require('dotenv').config();
const mongoose = require('mongoose');
const { dbConnect } = require('../DB/dbConnect');
const { Post } = require('../Models/Post');

async function fixIndexes() {
    try {
        // Connect to MongoDB
        await dbConnect();
        console.log('Connected to database');

        // Get collection reference
        const postCollection = mongoose.connection.collection('posts');

        // Drop all indexes except the default _id index
        const indexes = await postCollection.indexes();
        console.log('Current indexes:', indexes);

        for (const index of indexes) {
            if (index.name !== '_id_') {
                console.log(`Dropping index: ${index.name}`);
                await postCollection.dropIndex(index.name);
            }
        }

        console.log('All non-_id indexes dropped');

        // Create new indexes
        console.log('Creating new text index on title and content');
        await postCollection.createIndex(
            { title: 'text', content: 'text' },
            { name: 'title_content_text' }
        );

        console.log('Creating new index on tags field');
        await postCollection.createIndex(
            { tags: 1 },
            { name: 'tags_1' }
        );

        console.log('Index fix complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing indexes:', error);
        process.exit(1);
    }
}

fixIndexes();
