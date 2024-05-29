#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod file_sharing {
    use ink_storage::collections::HashMap as StorageHashMap;

    #[ink(storage)]
    pub struct FileSharing {
        files: StorageHashMap<Hash, FileInfo>,
    }

    #[derive(scale::Encode, scale::Decode, Clone, Default)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub struct FileInfo {
        owner: AccountId,
        file_name: Vec<u8>,
        file_size: u64,
    }

    #[ink(event)]
    pub struct FileUploaded {
        #[ink(topic)]
        hash: Hash,
        owner: AccountId,
    }

    impl FileSharing {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                files: StorageHashMap::new(),
            }
        }

        #[ink(message)]
        pub fn upload_file(&mut self, hash: Hash, file_name: Vec<u8>, file_size: u64) {
            let caller = self.env().caller();
            let file_info = FileInfo {
                owner: caller,
                file_name,
                file_size,
            };

            self.files.insert(hash, file_info.clone());

            self.env().emit_event(FileUploaded {
                hash,
                owner: caller,
            });
        }

        #[ink(message)]
        pub fn get_file_info(&self, hash: Hash) -> Option<FileInfo> {
            self.files.get(&hash).cloned()
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn upload_and_get_file_info_works() {
            let mut contract = FileSharing::new();
            let file_hash = [0x42; 32];
            let file_name = b"example.txt".to_vec();
            let file_size = 12345;

            contract.upload_file(file_hash, file_name.clone(), file_size);
            let file_info = contract.get_file_info(file_hash).unwrap();

            assert_eq!(file_info.owner, Default::default());
            assert_eq!(file_info.file_name, file_name);
            assert_eq!(file_info.file_size, file_size);
        }
    }
}
