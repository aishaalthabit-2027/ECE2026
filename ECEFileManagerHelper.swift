import Foundation

class ECEFileManagerHelper {
    static let shared = ECEFileManagerHelper()
    
    private init() {}
    
    func documentsURL() -> URL {
        return FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    }
    
    func saveData(_ data: Data, fileName: String) -> Bool {
        let fileURL = documentsURL().appendingPathComponent(fileName)
        do {
            try data.write(to: fileURL)
            return true
        } catch {
            print("Error saving file: \(error)")
            return false
        }
    }
    
    func loadData(fileName: String) -> Data? {
        let fileURL = documentsURL().appendingPathComponent(fileName)
        return try? Data(contentsOf: fileURL)
    }
}
