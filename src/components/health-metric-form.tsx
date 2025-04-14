import React, { useEffect, useState, useMemo } from 'react';
import HealthDataTable from './data-table.tsx';
import LineChartComponent from './chart.tsx';
import Header from './header.tsx';
import FormField from './form-fields.tsx';
import { HealthEntry, FormState, FormErrors } from './types.tsx';
import { convertGlassToLiters, getDayPeriod, exportToCsv } from './utils.tsx';

const HealthMetricForm: React.FC = () => {
   
    const [entries, setEntries] = useState<HealthEntry[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editingEntry, setEditingEntry] = useState<HealthEntry | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<string>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
    const [isInitialMount, setIsInitialMount] = useState<boolean>(true);
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem('dark_mode');
        return savedMode === 'true';
    });
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

   
    const [form, setForm] = useState<FormState>({
        waterLiters: "",
        waterGlasses: "",
        heartRate: "",
        steps: "",
        timestamp: ""
    });

   
    const [editForm, setEditForm] = useState<FormState>({
        waterLiters: "",
        waterGlasses: "",
        heartRate: "",
        steps: "",
        timestamp: ""
    });

    
    const [errors, setErrors] = useState<FormErrors>({
        steps: '',
        waterLiters: '',
        waterGlasses: '',
        heartRate: '',
        timestamp: '',
        form: ''
    });

    const [editErrors, setEditErrors] = useState<FormErrors>({
        steps: '',
        waterLiters: '',
        waterGlasses: '',
        heartRate: '',
        timestamp: '',
        form: ''
    });

    
    const validate = (formData: FormState, setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>): boolean => {
        let isValid = true;
        const error: Partial<FormErrors> = {};

        if (formData.steps === "" && formData.waterLiters === "" && formData.waterGlasses === "" && formData.heartRate === "") {
            if (!formData.timestamp) {
                error.form = "At least one health metric (steps, water intake, or heart rate) and Timestamp is required.";
                isValid = false;
            } else {
                error.form = "At least one health metric (steps, water intake, or heart rate) is required.";
                isValid = false;
            }
        } else {
        
            if (formData.steps) {
                const stepsValue = Number(formData.steps);
                if (stepsValue < 0) {
                    error.steps = "Please enter a valid step count.";
                    isValid = false;
                } else if (stepsValue > 100000) {
                    error.steps = "Step count seems too high. Please verify.";
                    isValid = false;
                }
            }

            if (formData.waterGlasses) {
                const glassesValue = Number(formData.waterGlasses);
                if (glassesValue < 0) {
                    error.waterGlasses = "Enter a valid number of glasses.";
                    isValid = false;
                } else if (glassesValue > 30) {
                    error.waterGlasses = "Water intake seems too high. Please verify.";
                    isValid = false;
                }
            }

            if (formData.heartRate) {
                const heartRateValue = Number(formData.heartRate);
                if (heartRateValue < 0) {
                    error.heartRate = "Enter a valid heart rate.";
                    isValid = false;
                } else if (heartRateValue > 220) {
                    error.heartRate = "Heart rate seems too high. Please verify.";
                    isValid = false;
                }
            }

            if (formData.waterLiters) {
                const litersValue = Number(formData.waterLiters);
                if (litersValue < 0) {
                    error.waterLiters = "Enter a valid amount of water in liters.";
                    isValid = false;
                } else if (litersValue > 10) {
                    error.waterLiters = "Water intake seems too high. Please verify.";
                    isValid = false;
                }
            }

            if (!formData.timestamp) {
                error.timestamp = "Please select a valid timestamp.";
                isValid = false;
            } else {
                const timestampDate = new Date(formData.timestamp);
                const now = new Date();
                if (timestampDate > now) {
                    error.timestamp = "Timestamp cannot be in the future.";
                    isValid = false;
                }
            }
        }
        
        setFormErrors(error as FormErrors);
        return isValid;
    };

 
    const handleFormChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        formState: FormState,
        setFormState: React.Dispatch<React.SetStateAction<FormState>>
    ): void => {
        const { name, value } = e.target;

        if (name === "waterLiters" && value !== "") {
            setFormState(prev => ({
                ...prev,
                waterLiters: value,
                waterGlasses: ""
            }));
        } else if (name === "waterGlasses" && value !== "") {
            setFormState(prev => ({
                ...prev,
                waterGlasses: value,
                waterLiters: ""
            }));
        } else {
            setFormState(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        handleFormChange(e, form, setForm);
    };

  
    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        handleFormChange(e, editForm, setEditForm);
    };

  
    const handleEdit = (entry: HealthEntry): void => {
        setEditingEntry(entry);
        setEditForm({
            steps: entry.steps?.toString() || '',
            waterLiters: entry.water?.toString() || '',
            waterGlasses: '',
            heartRate: entry.heartRate?.toString() || '',
            timestamp: entry.timestamp || '',
        });
        setEditErrors({
            steps: '',
            waterLiters: '',
            waterGlasses: '',
            heartRate: '',
            timestamp: '',
            form: ''
        });
        setIsEditModalOpen(true);
    };

   
    const confirmDelete = (id: number): void => {
        setDeleteConfirmId(id);
    };

    
    const handleDeleteConfirmed = (): void => {
        if (deleteConfirmId !== null) {
            setEntries(entries.filter(item => item.id !== deleteConfirmId));
            setDeleteConfirmId(null);
        }
    };


    const cancelDelete = (): void => {
        setDeleteConfirmId(null);
    };

  
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!validate(form, setErrors)) return;

        const water = form.waterLiters || convertGlassToLiters(form.waterGlasses);
        const newEntry = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            timestamp: form.timestamp,
            water: Number(water) || 0,
            heartRate: Number(form.heartRate) || 0,
            steps: Number(form.steps) || 0
        };

        setEntries(prev => [...prev, newEntry]);

 
        setForm({ waterLiters: '', waterGlasses: '', steps: '', heartRate: '', timestamp: '' });
        setErrors({
            steps: '',
            waterLiters: '',
            waterGlasses: '',
            heartRate: '',
            timestamp: '',
            form: '',
        });
    };

    
    const handleEditSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!validate(editForm, setEditErrors)) return;

        const water = editForm.waterLiters || convertGlassToLiters(editForm.waterGlasses);
        
        if (editingEntry) {
            const updatedEntry = {
                ...editingEntry,
                timestamp: editForm.timestamp,
                water: Number(water) || 0,
                heartRate: Number(editForm.heartRate) || 0,
                steps: Number(editForm.steps) || 0
            };

            setEntries(prev =>
                prev.map(item =>
                    item.id === editingEntry.id ? updatedEntry : item
                )
            );
            

            setIsEditModalOpen(false);
            setEditingEntry(null);
            setEditForm({ waterLiters: '', waterGlasses: '', steps: '', heartRate: '', timestamp: '' });
            setEditErrors({
                steps: '',
                waterLiters: '',
                waterGlasses: '',
                heartRate: '',
                timestamp: '',
                form: '',
            });
        }
    };

 
    const filteredEntries = useMemo(() => 
        selectedPeriod === 'all'
            ? entries
            : entries.filter(entry => getDayPeriod(entry.timestamp) === selectedPeriod),
        [entries, selectedPeriod]
    );

  
    const handleMode = () => {
        setDarkMode(prev => !prev);
    };


    useEffect(() => {
        try {
            const storedEntries = localStorage.getItem('health_entries');
            if (storedEntries) {
                setEntries(JSON.parse(storedEntries));
            }
        } catch (error) {
            console.error('Failed to load entries from localStorage:', error);
           
        }
    }, []);


    useEffect(() => {
        if (isInitialMount) {
            setIsInitialMount(false);
            return;
        }
        
        try {
            localStorage.setItem('health_entries', JSON.stringify(entries));
            localStorage.setItem('dark_mode', darkMode.toString());
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
          
        }
    }, [entries, darkMode, isInitialMount]);

   
    const renderFormFields = (
        formData: FormState, 
        formErrors: FormErrors,
        onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
    ) => (
        <>
            {formErrors.form && (
                <div className="w-full mb-4">
                    <p className="text-red-500 text-sm font-medium">{formErrors.form}</p>
                </div>
            )}
            <div className='flex flex-col md:flex-row w-full gap-4 mt-5'>
                <FormField
                    label="Steps Count"
                    name="steps"
                    type="number"
                    value={formData.steps}
                    placeholder="Enter steps"
                    error={formErrors.steps}
                    onChange={onChangeHandler}
                    darkMode={darkMode}
                />
                <FormField
                    label="Water Intake (Liters)"
                    name="waterLiters"
                    type="number"
                    value={formData.waterLiters}
                    placeholder="Enter water in liters"
                    error={formErrors.waterLiters}
                    onChange={onChangeHandler}
                    darkMode={darkMode}
                    disabled={!!formData.waterGlasses}
                />
            </div>

            <div className='flex flex-col md:flex-row w-full gap-4'>
                <FormField
                    label="Water Intake (Glasses)"
                    name="waterGlasses"
                    type="number"
                    value={formData.waterGlasses}
                    placeholder="Enter water in glasses"
                    error={formErrors.waterGlasses}
                    onChange={onChangeHandler}
                    darkMode={darkMode}
                    disabled={!!formData.waterLiters}
                />
                <FormField
                    label="Heart Rate (bpm)"
                    name="heartRate"
                    type="number"
                    value={formData.heartRate}
                    placeholder="Enter heart rate in bpm"
                    error={formErrors.heartRate}
                    darkMode={darkMode}
                    onChange={onChangeHandler}
                />
            </div>

            <div className="w-full">
                <label className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-600'} mb-2`}>Timestamp</label>
                <input
                    type="datetime-local"
                    name="timestamp"
                    value={formData.timestamp}
                    className={`p-2 border-2 rounded-xl text-black bg-bg w-full ${formErrors.timestamp ? 'border-red-500' : 'custom-border'}`}
                    onChange={onChangeHandler}
                />
                <div className="min-h-[1.25rem] mt-1">
                    {formErrors.timestamp && (
                        <p className="text-red-500 text-sm">{formErrors.timestamp}</p>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <>
            <Header 
                onExport={() => exportToCsv(filteredEntries)} 
                switchMode={handleMode} 
                darkMode={darkMode} 
                selectedPeriod={selectedPeriod} 
                setSelectedPeriod={setSelectedPeriod}
            />
            <div className={`mx-4 md:mx-9 ${darkMode ? 'bg-black' : 'bg-white'} rounded-xl custom-border py-4 px-5 gap-4 mt-5`}>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-start rounded-xl"
                >
                    <h1 className={`${darkMode ? 'text-darkprimary' : 'text-primary'} text-xl font-bold tracking-tight`}>Add New Health Metrics</h1>
                    {renderFormFields(form, errors, handleChange)}
                    <div className="w-full">
                        <button type="submit" className="bg-primary rounded-xl text-white py-2 px-5 h-10.5 w-full">
                            Add Entry
                        </button>
                    </div>
                </form>

                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-lg">
                            <h2 className="text-lg font-semibold mb-4 text-primary">Edit Health Entry</h2>
                            <form onSubmit={handleEditSubmit}>
                                {renderFormFields(editForm, editErrors, handleEditFormChange)}
                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setEditingEntry(null);
                                        }}
                                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {entries.length > 0 && (
                    <div className="bg-bg rounded-xl border custom-border mt-5">
                        <div className="mt-2 flex items-center justify-end mr-5">
                            <label htmlFor="metricFilter" className="text-md font-medium text-black">
                                Filter Metrics:
                            </label>
                            <select
                                id="metricFilter"
                                className="border custom-border rounded px-3 py-1 text-black ml-1"
                                value={selectedMetric}
                                onChange={(e) => setSelectedMetric(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="steps">Steps</option>
                                <option value="heartRate">Heart Rate</option>
                                <option value="water">Water</option>
                            </select>
                        </div>

                        <LineChartComponent data={filteredEntries} selectedMetric={selectedMetric} />
                    </div>
                )}

                <div className='mt-5'>
                    <HealthDataTable 
                        data={filteredEntries} 
                        handleEdit={handleEdit} 
                        handleDelete={confirmDelete} 
                    />
                </div>
            </div>

            
            {deleteConfirmId !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4 text-black">Confirm Deletion</h2>
                        <p className="mb-6 text-black">Are you sure you want to delete this entry? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirmed}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HealthMetricForm;
