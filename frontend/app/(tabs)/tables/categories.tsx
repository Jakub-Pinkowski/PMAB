import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface Category {
    id?: number;
    name: string;
}

export default function CategoriesScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [newCategory, setNewCategory] = useState<Category>({ name: '' });

    // Fetch categories from the backend
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5094/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handlePress = (categoryId: string) => {
        setExpanded(prev => (prev === categoryId ? null : categoryId));
    };

    // Handle Edit Category
    const handleEditCategory = (category: Category) => {
        setEditCategory(category);
        setIsEditModalVisible(true);
    };

    // Handle Update Category
    const handleUpdateCategory = async () => {
        if (editCategory) {
            try {
                const response = await axios.put(`http://localhost:5094/categories/${editCategory.id}`, editCategory);
                if (response.status === 200) {
                    const updatedCategories = categories.map(cat =>
                        cat.id === editCategory.id ? response.data : cat
                    );
                    setCategories(updatedCategories);
                    setIsEditModalVisible(false);
                    setEditCategory(null);
                    Alert.alert('Success', 'Category updated successfully');
                } else {
                    Alert.alert('Error', 'Failed to update the category');
                }
            } catch (error) {
                console.error('Error updating category:', error);
                Alert.alert('Error', 'Failed to update the category');
            }
        }
    };

    // Handle Add Category
    const handleAddCategory = async () => {
        if (!newCategory.name) {
            Alert.alert('Missing Fields', 'Please enter a name for the new category.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5094/categories', newCategory);
            setCategories(prev => [...prev, response.data]);
            setNewCategory({ name: '' });
            setIsAddModalVisible(false);
        } catch (error) {
            console.error('Error adding category:', error);
            Alert.alert('Error', 'Failed to add the category');
        }
    };

    // Handle Delete Category
    const handleDeleteCategory = (categoryId: number) => {
        // Check if the app is running on web, and use window.confirm on the web.
        if (typeof window !== 'undefined') {
            // Web environment
            const confirmation = window.confirm('Are you sure you want to delete this category?');
            if (confirmation) {
                deleteCategoryFromBackend(categoryId);
            } else {
                console.log('Delete cancelled');
            }
        } else {
            // For mobile platforms (iOS/Android), use the React Native Alert
            Alert.alert('Delete Customer', 'Are you sure you want to delete this category?', [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteCategoryFromBackend(categoryId);
                    },
                    style: 'destructive',
                },
            ]);
        }
    };

    // Function to delete category from the backend and update UI
    const deleteCategoryFromBackend = async (categoryId: number) => {
        try {
            setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
            const response = await axios.delete(`http://localhost:5094/categories/${categoryId}`);
            if (response.status === 200) {
                fetchCategories();
                Alert.alert('Success', 'Category deleted successfully');
            } else {
                fetchCategories();
                Alert.alert('Error', 'Failed to delete the category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            fetchCategories();
            Alert.alert('Error', 'Failed to delete the category');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Categories</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Category</Text>
            </TouchableOpacity>

            {categories.map((category) => (
                <View key={category.id} style={styles.card}>
                    <TouchableOpacity
                        onPress={() => handlePress(category.id?.toString() || '')}
                        style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{category.name}</Text>
                    </TouchableOpacity>

                    {expanded === category.id?.toString() && (
                        <View style={styles.cardContent}>
                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleEditCategory(category)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => handleDeleteCategory(category.id!)}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            ))}

            {/* Modal for editing a category */}
            <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Category</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={editCategory?.name || ''}
                            onChangeText={text => setEditCategory(prev => ({ ...prev!, name: text }))}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleUpdateCategory}>
                                <Text style={styles.actionButtonText}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => setIsEditModalVisible(false)}>
                                <Text style={styles.actionButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for adding a new category */}
            <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Category</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newCategory.name}
                            onChangeText={text => setNewCategory(prev => ({ ...prev, name: text }))}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleAddCategory}>
                                <Text style={styles.actionButtonText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => setIsAddModalVisible(false)}>
                                <Text style={styles.actionButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.light.background,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 10,
        borderRadius: 4,
        marginBottom: 16,
    },
    addButtonText: {
        color: Colors.light.background,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardEmail: {
        fontSize: 14,
        color: '#888',
    },
    cardContent: {
        marginTop: 8,
    },
    cardLabel: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    cardValue: {
        fontSize: 14,
        marginBottom: 8,
    },
    button: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    deleteButton: {
        backgroundColor: Colors.light.danger,
    },
    buttonText: {
        color: Colors.light.background,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    updateButton: {
        backgroundColor: Colors.light.primary,
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
});
