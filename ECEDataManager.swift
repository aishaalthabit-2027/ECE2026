import Foundation

// Simple data model for persisting app data
class ECEDataManager {
    static let shared = ECEDataManager()
    
    private let dbKey = "ece_db_v5"
    private let sessionKey = "ece_session_v5"
    
    private init() {}
    
    // MARK: - Database (Institutions, etc.)
    func loadDatabase() -> [String: Any]? {
        return UserDefaults.standard.dictionary(forKey: dbKey)
    }
    
    func saveDatabase(_ data: [String: Any]) {
        UserDefaults.standard.set(data, forKey: dbKey)
    }
    
    func resetDatabase() {
        UserDefaults.standard.removeObject(forKey: dbKey)
        UserDefaults.standard.removeObject(forKey: sessionKey)
        // Note: In a full implementation, we would also clear IndexedDB equivalent
    }
    
    // MARK: - Session
    func loadSession() -> [String: Any]? {
        return UserDefaults.standard.dictionary(forKey: sessionKey)
    }
    
    func saveSession(_ data: [String: Any]) {
        UserDefaults.standard.set(data, forKey: sessionKey)
    }
    
    func clearSession() {
        UserDefaults.standard.removeObject(forKey: sessionKey)
    }
    
    // MARK: - File Storage (Simulated)
    // In a real implementation, you would use the file system or Core Data
    func saveFileData(_ data: Data, withName name: String) -> URL? {
        let fileURL = FileManager.default.temporaryDirectory
            .appendingPathComponent(name)
        
        do {
            try data.write(to: fileURL)
            return fileURL
        } catch {
            print("Error saving file: \(error)")
            return nil
        }
    }
    
    func loadFileData(named name: String) -> Data? {
        let fileURL = FileManager.default.temporaryDirectory
            .appendingPathComponent(name)
        
        return try? Data(contentsOf: fileURL)
    }
}
