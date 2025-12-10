package com.example.backend.BackEnd.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.backend.BackEnd.model.Contacto;
import com.example.backend.BackEnd.repository.ContactoRepository;
import com.example.backend.BackEnd.service.ContactoService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1/contacto")
public class ContactoController {
    
    @Autowired
    private ContactoService contactoService;
    @GetMapping("/all")
    public List<Contacto> getAllContacto() {
        return contactoService.getAllContactos();
    }
    @PostMapping("/save")
    public Contacto postContacto(@RequestBody Contacto entity) {        
        return contactoService.saveContacto(entity);
    }
    @GetMapping("/find/{idContacto}")
    public Optional<Contacto> getContactoId(@PathVariable Long idContacto) {
        return contactoService.findByIdContacto(idContacto);
    }

    @DeleteMapping("/delete/{idContacto}")
    public void deleteContacto(@PathVariable Long idContacto){
        contactoService.deleteContacto(idContacto);
    }
    
    @Autowired
    private ContactoRepository contactoRepository;
    @PutMapping("/update/{idContacto}")
    public Optional<Object> 
        putContacto(@PathVariable Long idContacto, @RequestBody Contacto entity) {
        
        return contactoRepository.findById(idContacto)
        .map(existeContacto->{
            existeContacto.setNombreContacto(entity.getNombreContacto());
            existeContacto.setCorreoContacto(entity.getCorreoContacto());
            existeContacto.setAsuntoContacto(entity.getAsuntoContacto());
            existeContacto.setMensajeContacto(entity.getMensajeContacto());
            
            Contacto contactoUpdate = contactoRepository.save(existeContacto);
            return contactoUpdate;
        });
    }

    
    
}


