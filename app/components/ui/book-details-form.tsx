import React, { useState } from "react";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSignupStore } from "../../store/signup-store";

interface BookDetailsFormProps {
    onNext: () => void;
    loading?: boolean;
    showLabels?: boolean;
}

export default function BookDetailsForm({
    onNext,
    loading = false,
    showLabels = false,
}: BookDetailsFormProps) {
    const {
        bookName,
        setBookName,
        author,
        setAuthor,
        totalPages,
        setTotalPages,
    } = useSignupStore();

    const [errors, setErrors] = useState({
        bookName: "",
        author: "",
        totalPages: "",
    });
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleNext = () => {
        const newErrors = {
            bookName: bookName.trim() ? "" : "Please enter the book name",
            author: author.trim() ? "" : "Please enter the author's name",
            totalPages: totalPages.trim() ? "" : "Please enter number of pages",
        };
        setErrors(newErrors);

        const hasError = Object.values(newErrors).some((e) => e !== "");
        if (!hasError) {
            onNext();
        }
    };

    const handleChange = (
        field: "bookName" | "author" | "totalPages",
        value: string
    ) => {
        if (field === "bookName") setBookName(value);
        if (field === "author") setAuthor(value);
        if (field === "totalPages") setTotalPages(value);

        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    return (
        <View className="gap-4 w-full">
            <View>
                {showLabels && <Text className="mb-2 font-medium">Book Name</Text>}
                <TextInput
                    value={bookName}
                    onChangeText={(text) => handleChange("bookName", text)}
                    onFocus={() => setFocusedField("bookName")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter Book Name"
                    placeholderTextColor="#999"
                    className="w-full py-4 px-4 rounded-lg border text-lg bg-white"
                    style={{
                        borderColor: focusedField === "bookName" ? "#722F37" : "#CCD1D3",
                    }}
                />
                {errors.bookName ? (
                    <Text className="text-red-500 text-sm mt-1">{errors.bookName}</Text>
                ) : null}
            </View>

            <View>
                {showLabels && <Text className="mb-2 font-medium">Author</Text>}
                <TextInput
                    value={author}
                    onChangeText={(text) => handleChange("author", text)}
                    onFocus={() => setFocusedField("author")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter Author's Name"
                    placeholderTextColor="#999"
                    className="w-full py-4 px-4 rounded-lg border text-lg bg-white"
                    style={{
                        borderColor: focusedField === "author" ? "#722F37" : "#CCD1D3",
                    }}
                />
                {errors.author ? (
                    <Text className="text-red-500 text-sm mt-1">{errors.author}</Text>
                ) : null}
            </View>

            <View>
                {showLabels && <Text className="mb-2 font-medium">Total Pages</Text>}
                <TextInput
                    value={totalPages}
                    onChangeText={(text) => handleChange("totalPages", text)}
                    onFocus={() => setFocusedField("totalPages")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter Number of Pages"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                    className="w-full py-4 px-4 rounded-lg border text-lg bg-white"
                    style={{
                        borderColor: focusedField === "totalPages" ? "#722F37" : "#CCD1D3",
                    }}
                />
                {errors.totalPages ? (
                    <Text className="text-red-500 text-sm mt-1">{errors.totalPages}</Text>
                ) : null}
            </View>

            <View className="mt-6">
                <TouchableOpacity
                    onPress={handleNext}
                    className="bg-[#722F37] w-full py-4 rounded-lg flex-row justify-center items-center"
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-bold text-center text-lg">
                            Next
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
